"use client";

export default function PrintButton() {
  return (
    <button type="button" className="primary-button worksheet-print-button" onClick={() => window.print()}>
      Print this worksheet
    </button>
  );
}
