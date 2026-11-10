"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import BrandMark from "@/components/BrandMark";
import MeasuringTape from "@/components/MeasuringTape";

// Sign in / create a customer account. Anyone who signs up here becomes a
// plain customer (set by the database), so this app can never reach shop data.
export default function AuthForm() {
  const [mode, setMode] = useState("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setNotice("");
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (error) throw error;
        if (!data.session) {
          setNotice("Account created! Check your email to confirm it, then sign in.");
          setMode("signin");
        }
      }
      // On success the page notices the new session by itself.
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm animate-rise">
        <div className="text-center mb-6">
          <BrandMark className="w-12 h-12 mx-auto text-brass" />
          <h1 className="font-display text-3xl text-ink mt-3">Bane Brother Tailor</h1>
          <p className="text-muted text-sm mt-1">
            {mode === "signin" ? "Sign in to book your visit" : "Create an account to book your visit"}
          </p>
          <MeasuringTape className="text-brass/50 mt-4" units={14} />
        </div>

        <form onSubmit={handleSubmit} className="card-raised space-y-4">
          {mode === "signup" && (
            <div>
              <label className="label">Your name</label>
              <input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>
          )}
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>
          {notice && <p className="text-sage text-sm">{notice}</p>}
          {error && <p className="text-thread text-sm">{error}</p>}
          <button type="submit" disabled={busy} className="btn-primary w-full">
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-4">
          {mode === "signin" ? (
            <>New here? <button className="text-brass underline" onClick={() => { setMode("signup"); setError(""); }}>Create an account</button></>
          ) : (
            <>Already have an account? <button className="text-brass underline" onClick={() => { setMode("signin"); setError(""); }}>Sign in</button></>
          )}
        </p>
      </div>
    </div>
  );
}
