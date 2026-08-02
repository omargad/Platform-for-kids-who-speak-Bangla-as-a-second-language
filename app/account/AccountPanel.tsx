"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AccountPanel({ email, displayName }: { email: string; displayName: string }) {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function changePassword(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setPasswordMessage(null);
    try {
      const response = await fetch("/api/account/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        setPasswordMessage({ ok: false, text: data.error ?? "Could not change the password." });
        return;
      }
      setCurrentPassword("");
      setNewPassword("");
      setPasswordMessage({
        ok: true,
        text: "Password changed. Any other signed-in devices have been signed out.",
      });
    } catch {
      setPasswordMessage({ ok: false, text: "Could not reach the server. Try again." });
    } finally {
      setBusy(false);
    }
  }

  async function signOutEverywhere() {
    setBusy(true);
    try {
      await fetch("/api/account/sessions", { method: "DELETE" });
      router.push("/");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function deleteAccount(event: React.FormEvent) {
    event.preventDefault();
    setDeleteError(null);
    if (deleteConfirm.trim().toUpperCase() !== "DELETE") {
      setDeleteError('Type "DELETE" to confirm you want everything removed.');
      return;
    }
    setBusy(true);
    try {
      const response = await fetch("/api/account/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: deletePassword }),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        setDeleteError(data.error ?? "Could not delete the account.");
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setDeleteError("Could not reach the server. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="adult-content account-content">
      <section className="adult-hero">
        <div>
          <p className="adult-eyebrow">Account controls</p>
          <h1>Your data, in your hands.</h1>
          <p>
            Signed in as <strong>{displayName}</strong> ({email}). Everything this account owns —
            learner profiles, progress, assignments and studio records — can be exported or
            permanently deleted here.
          </p>
        </div>
      </section>

      <div className="account-grid">
        <section className="account-card" aria-labelledby="account-password">
          <h2 id="account-password">Change password</h2>
          <p>Changing your password signs out every other device.</p>
          <form onSubmit={changePassword}>
            <label>
              Current password
              <input
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                required
                autoComplete="current-password"
              />
            </label>
            <label>
              New password <small>(at least 10 characters)</small>
              <input
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                minLength={10}
                required
                autoComplete="new-password"
              />
            </label>
            {passwordMessage && (
              <p className={passwordMessage.ok ? "auth-success" : "auth-error"} role="status">
                {passwordMessage.text}
              </p>
            )}
            <button type="submit" className="auth-submit" disabled={busy}>
              {busy ? "One moment…" : "Change password"}
            </button>
          </form>
        </section>

        <section className="account-card" aria-labelledby="account-data">
          <h2 id="account-data">Your family&rsquo;s data</h2>
          <p>
            Download a machine-readable copy of everything stored for this account: learner
            profiles, six-skill progress, assignments and content-studio records.
          </p>
          <a className="outline-button" href="/api/account/export" download>
            Download data export (JSON)
          </a>
          <h3>Sessions</h3>
          <p>Suspect a shared or public computer stayed signed in? End every session at once.</p>
          <button type="button" className="outline-button" onClick={() => void signOutEverywhere()} disabled={busy}>
            Sign out everywhere
          </button>
        </section>

        <section className="account-card account-danger" aria-labelledby="account-delete">
          <h2 id="account-delete">Delete account</h2>
          <p>
            Permanently removes this grown-up account and everything it owns: all learner profiles,
            progress, assignments, drafts, reviews and uploaded audio. Children&rsquo;s device-local
            stars are unaffected. This cannot be undone — export your data first if you want a copy.
          </p>
          <form onSubmit={deleteAccount}>
            <label>
              Current password
              <input
                type="password"
                value={deletePassword}
                onChange={(event) => setDeletePassword(event.target.value)}
                required
                autoComplete="current-password"
              />
            </label>
            <label>
              Type <strong>DELETE</strong> to confirm
              <input
                type="text"
                value={deleteConfirm}
                onChange={(event) => setDeleteConfirm(event.target.value)}
                required
              />
            </label>
            {deleteError && (
              <p className="auth-error" role="alert">
                {deleteError}
              </p>
            )}
            <button type="submit" className="danger-button" disabled={busy}>
              {busy ? "One moment…" : "Permanently delete account"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
