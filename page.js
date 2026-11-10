"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Loader from "@/components/Loader";
import BrandMark from "@/components/BrandMark";
import AuthForm from "@/components/AuthForm";
import BookingForm from "@/components/BookingForm";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadProfile(s) {
      if (!s) { if (active) { setProfile(null); setLoading(false); } return; }
      const { data } = await supabase.from("profiles").select("*").eq("id", s.user.id).single();
      if (active) { setProfile(data); setLoading(false); }
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!active) return;
      setSession(session);
      loadProfile(session);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      loadProfile(newSession);
    });
    return () => { active = false; sub.subscription.unsubscribe(); };
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader /></div>;
  if (!session) return <AuthForm />;

  // Staff/owner accounts belong in the shop app, not here.
  if (profile && profile.role !== "customer") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="card-raised max-w-sm text-center space-y-3">
          <p className="font-display text-xl text-ink">This is the customer app</p>
          <p className="text-muted text-sm">You're signed in as shop staff. Please use the Bane Brother Tailor shop app instead.</p>
          <button onClick={signOut} className="btn-secondary w-full">Sign out</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between px-4 py-3 bg-ink text-white fabric-weave-dark">
        <div className="flex items-center gap-2">
          <BrandMark className="w-6 h-6 text-brass" />
          <span className="font-display text-lg">Bane Brother Tailor</span>
        </div>
        <button onClick={signOut} className="text-xs text-white/70 underline">Sign out</button>
      </header>
      <main className="max-w-2xl mx-auto p-4 md:p-8">
        <BookingForm session={session} profile={profile} />
      </main>
    </div>
  );
}
