"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Mode = "sign-in" | "sign-up";

export default function AuthCard({ returnTo }: { returnTo: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("sign-in");
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const endpoint = mode === "sign-in" ? "/api/auth/sign-in" : "/api/auth/sign-up";
      const payload =
        mode === "sign-in" ? { email, password } : { email, password, displayName };
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
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

  return (
    <section className="auth-card" aria-label="Grown-up account">
      <div className="auth-tabs" role="tablist" aria-label="Sign in or create account">
        <button
          type="button"
          role="tab"
          aria-selected={mode === "sign-in"}
          className={mode === "sign-in" ? "active" : ""}
          onClick={() => setMode("sign-in")}
        >
          Sign in
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "sign-up"}
          className={mode === "sign-up" ? "active" : ""}
          onClick={() => setMode("sign-up")}
        >
          Create account
        </button>
      </div>

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
        <label>
          Password {mode === "sign-up" && <small>(at least 10 characters)</small>}
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={mode === "sign-up" ? 10 : undefined}
            required
            autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
          />
        </label>
        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="auth-submit" disabled={busy}>
          {busy ? "One moment…" : mode === "sign-in" ? "Sign in" : "Create account"}
        </button>
      </form>
      <p className="auth-note">
        Grown-up accounts store only your email, display name and a securely hashed password.
        Learner profiles you create hold no child contact details.
      </p>
    </section>
  );
}
