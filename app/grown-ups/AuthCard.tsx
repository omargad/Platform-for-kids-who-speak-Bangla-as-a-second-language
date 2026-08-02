"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Mode = "sign-in" | "sign-up" | "recover";

export default function AuthCard({ returnTo }: { returnTo: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("sign-in");
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [issuedCodes, setIssuedCodes] = useState<string[] | null>(null);
  const [codesCopied, setCodesCopied] = useState(false);

  function switchMode(next: Mode) {
    setMode(next);
    setError(null);
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const endpoint =
        mode === "sign-in"
          ? "/api/auth/sign-in"
          : mode === "sign-up"
            ? "/api/auth/sign-up"
            : "/api/auth/recover";
      const payload =
        mode === "sign-in"
          ? { email, password }
          : mode === "sign-up"
            ? { email, password, displayName }
            : { email, recoveryCode, newPassword: password };
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
        recoveryCodes?: string[];
      };
      if (!response.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      if (mode === "sign-up" && data.recoveryCodes?.length) {
        // Show the one-time recovery codes before leaving the page.
        setIssuedCodes(data.recoveryCodes);
        return;
      }
      router.push(returnTo);
      router.refresh();
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  async function copyCodes() {
    if (!issuedCodes) return;
    try {
      await navigator.clipboard.writeText(issuedCodes.join("\n"));
      setCodesCopied(true);
    } catch {
      setCodesCopied(false);
    }
  }

  if (issuedCodes) {
    return (
      <section className="auth-card" aria-label="Recovery codes">
        <h2 className="auth-codes-title">Save your recovery codes</h2>
        <p className="auth-note">
          There is no email reset on this platform. If you forget your password, one of these
          one-time codes is the only way back into your account. Store them somewhere safe — they
          are shown only once.
        </p>
        <ul className="auth-codes" aria-label="One-time recovery codes">
          {issuedCodes.map((code) => (
            <li key={code}>
              <code>{code}</code>
            </li>
          ))}
        </ul>
        <div className="auth-codes-actions">
          <button type="button" className="outline-button" onClick={() => void copyCodes()}>
            {codesCopied ? "Copied ✓" : "Copy all codes"}
          </button>
          <button
            type="button"
            className="auth-submit"
            onClick={() => {
              router.push(returnTo);
              router.refresh();
            }}
          >
            I&rsquo;ve saved them — continue
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="auth-card" aria-label="Grown-up account">
      <div className="auth-tabs" role="tablist" aria-label="Sign in or create account">
        <button
          type="button"
          role="tab"
          aria-selected={mode === "sign-in"}
          className={mode === "sign-in" ? "active" : ""}
          onClick={() => switchMode("sign-in")}
        >
          Sign in
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "sign-up"}
          className={mode === "sign-up" ? "active" : ""}
          onClick={() => switchMode("sign-up")}
        >
          Create account
        </button>
      </div>

      {mode === "recover" && (
        <p className="auth-note" role="note">
          Enter one unused recovery code from the list you saved at sign-up. The code is consumed
          and every signed-in device is signed out.
        </p>
      )}

      <form onSubmit={submit}>
        {mode === "sign-up" && (
          <label>
            Your name (shown to learners)
            <input
              type="text"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              maxLength={60}
              required
              autoComplete="name"
            />
          </label>
        )}
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            maxLength={120}
            required
            autoComplete="email"
          />
        </label>
        {mode === "recover" && (
          <label>
            Recovery code
            <input
              type="text"
              value={recoveryCode}
              onChange={(event) => setRecoveryCode(event.target.value)}
              maxLength={20}
              required
              placeholder="XXXXX-XXXXX"
              autoComplete="one-time-code"
            />
          </label>
        )}
        <label>
          {mode === "sign-in" ? "Password" : mode === "sign-up" ? "Password" : "New password"}{" "}
          {mode !== "sign-in" && <small>(at least 10 characters)</small>}
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={mode === "sign-in" ? undefined : 10}
            required
            autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
          />
        </label>
        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="auth-submit" disabled={busy}>
          {busy
            ? "One moment…"
            : mode === "sign-in"
              ? "Sign in"
              : mode === "sign-up"
                ? "Create account"
                : "Reset password"}
        </button>
      </form>

      {mode === "sign-in" && (
        <button type="button" className="auth-link" onClick={() => switchMode("recover")}>
          Forgot your password? Use a recovery code
        </button>
      )}
      {mode === "recover" && (
        <button type="button" className="auth-link" onClick={() => switchMode("sign-in")}>
          Back to sign in
        </button>
      )}

      <p className="auth-note">
        Grown-up accounts store only your email, display name and a securely hashed password.
        Learner profiles you create hold no child contact details.
      </p>
    </section>
  );
}
