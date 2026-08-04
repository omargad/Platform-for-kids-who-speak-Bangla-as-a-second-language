#!/usr/bin/env bash
# Back up the platform's entire application state (.data: SQLite database +
# uploaded media) to a timestamped tar.gz, keeping the newest N backups.
#
#   scripts/backup.sh [backup-dir] [keep-count]
#
# Defaults: backup-dir=./backups, keep-count=14 (two weeks of daily backups).
# Cron example (daily at 03:00):
#   0 3 * * * cd /home/ubuntu/bangla-adventures && bash scripts/backup.sh /var/backups/bangla 14
set -euo pipefail

DATA_DIR="${DATA_DIR:-.data}"
BACKUP_DIR="${1:-./backups}"
KEEP="${2:-14}"

if [ ! -d "$DATA_DIR" ]; then
  echo "Nothing to back up: $DATA_DIR does not exist yet." >&2
  exit 0
fi

mkdir -p "$BACKUP_DIR"
STAMP="$(date +%Y%m%d-%H%M%S)"
TARGET="$BACKUP_DIR/bangla-data-$STAMP.tar.gz"

# SQLite in WAL mode: flush the WAL into the main file first so the archived
# .db is complete on its own. Harmless if sqlite3 is unavailable.
DB_FILE="${DATABASE_PATH:-$DATA_DIR/bangla-adventures.db}"
if command -v sqlite3 >/dev/null 2>&1 && [ -f "$DB_FILE" ]; then
  sqlite3 "$DB_FILE" "PRAGMA wal_checkpoint(TRUNCATE);" >/dev/null || true
fi

tar -czf "$TARGET" "$DATA_DIR"
echo "Backed up $DATA_DIR -> $TARGET ($(du -h "$TARGET" | cut -f1))"

# Retention: delete oldest beyond KEEP.
ls -1t "$BACKUP_DIR"/bangla-data-*.tar.gz 2>/dev/null | tail -n +$((KEEP + 1)) | while read -r old; do
  rm -f "$old"
  echo "Pruned old backup: $old"
done
