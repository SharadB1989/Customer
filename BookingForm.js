"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Loader from "@/components/Loader";
import HangTag from "@/components/HangTag";
import MeasuringTape from "@/components/MeasuringTape";
import ClothPhoto from "@/components/ClothPhoto";
import SewingMachineIcon from "@/components/icons/SewingMachineIcon";
import IronIcon from "@/components/icons/IronIcon";

const SLOTS = [
  { value: "10am-1pm", label: "10 am – 1 pm", hint: "Morning" },
  { value: "3pm-6pm", label: "3 pm – 6 pm", hint: "Afternoon" },
  { value: "6pm-9pm", label: "6 pm – 9 pm", hint: "Evening" },
];

const STATUS_STYLE = {
  requested: "text-brass-dark",
  confirmed: "text-sage",
  completed: "text-muted",
  cancelled: "text-thread",
};

function clothsOf(a) {
  if (a.cloth_varieties && a.cloth_varieties.length) return a.cloth_varieties;
  return a.cloth_variety ? [a.cloth_variety] : [];
}

export default function BookingForm({ session, profile }) {
  const [cloths, setCloths] = useState([]); // the shop's Stock > Cloth variety list
  const [mine, setMine] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [locating, setLocating] = useState(false);
  const [justBooked, setJustBooked] = useState(false);
  const [selected, setSelected] = useState([]); // ticked cloth names

  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const [form, setForm] = useState({
    customer_name: profile?.full_name || "",
    phone: "",
    address: "",
    google_location: "",
    preferred_date: today,
    preferred_slot: "10am-1pm",
    notes: "",
  });

  function set(field, value) { setForm((f) => ({ ...f, [field]: value })); }

  function toggleCloth(name) {
    setSelected((s) => (s.includes(name) ? s.filter((n) => n !== name) : [...s, name]));
  }

  async function loadMine() {
    const { data } = await supabase.from("appointments").select("*").order("created_at", { ascending: false });
    setMine(data || []);
  }

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("cloth_varieties").select("name, price, photo_path").order("name");
      setCloths(data || []);
      await loadMine();
      setLoading(false);
    }
    load();
  }, []);

  function shareMyLocation() {
    setError("");
    if (!navigator.geolocation) { setError("This device can't share its location — paste a Google Maps link instead."); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        set("google_location", `https://www.google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}`);
        setLocating(false);
      },
      () => {
        setError("Couldn't get your location — please allow location access, or paste a Google Maps link instead.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const { error } = await supabase.from("appointments").insert({
        customer_id: session.user.id,
        customer_name: form.customer_name,
        phone: form.phone,
        address: form.address || null,
        google_location: form.google_location || null,
        cloth_variety: selected[0] || null, // first pick, for older screens
        cloth_varieties: selected,
        preferred_date: form.preferred_date,
        preferred_slot: form.preferred_slot,
        notes: form.notes || null,
      });
      if (error) throw error;
      setJustBooked(true);
      setSelected([]);
      setForm((f) => ({ ...f, notes: "" }));
      await loadMine();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <section className="rounded-lg overflow-hidden bg-ink text-white fabric-weave-dark animate-rise">
        <div className="px-5 pt-6 pb-4 flex items-start justify-between gap-4">
          <div className="space-y-3">
            <HangTag />
            <h1 className="font-display text-2xl md:text-3xl leading-tight pt-2">
              Pick your cloths.<br />We'll visit you.
            </h1>
            <p className="text-white/60 text-sm max-w-xs">
              Choose the fabrics you like, tell us where and when. Our agent will visit you at your address with the cloth, and you can finalise your pick at the visit.
            </p>
          </div>
          <div className="hidden sm:flex flex-col items-center gap-2 text-brass/80 pt-2">
            <SewingMachineIcon className="w-20 h-20" />
            <IronIcon className="w-16 h-16" />
          </div>
        </div>
        <div className="sm:hidden flex justify-end gap-3 px-5 pb-2 text-brass/70">
          <SewingMachineIcon className="w-10 h-10" />
          <IronIcon className="w-9 h-9" />
        </div>
        <MeasuringTape className="text-brass/60" />
      </section>

      {justBooked && (
        <div className="card-raised text-center animate-rise">
          <p className="font-display text-xl text-sage">Appointment requested ✓</p>
          <p className="text-muted text-sm mt-1">Thank you! The shop will call you to confirm the visit to your address.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="card space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg text-ink flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brass text-white text-sm flex items-center justify-center">1</span>
              Choose the cloths you like
            </h2>
            {selected.length > 0 && <span className="text-xs text-brass-dark font-medium">{selected.length} selected</span>}
          </div>
          {cloths.length === 0 ? (
            <p className="text-muted text-sm">The shop hasn't added any cloth yet — you can still book and choose at the visit.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {cloths.map((c) => {
                const ticked = selected.includes(c.name);
                return (
                  <label
                    key={c.name}
                    className={`relative cursor-pointer rounded border p-2 transition-colors ${
                      ticked ? "border-brass bg-brass/10 ring-2 ring-brass/40" : "border-line bg-card hover:border-brass/50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="absolute top-3 left-3 w-5 h-5 accent-[#A8791E] z-10"
                      checked={ticked}
                      onChange={() => toggleCloth(c.name)}
                    />
                    <ClothPhoto path={c.photo_path} alt={c.name} className="w-full h-24" />
                    <p className="font-medium text-ink text-sm mt-2">{c.name}</p>
                    {Number(c.price) > 0 && <p className="text-xs text-muted font-mono">₹{c.price}</p>}
                  </label>
                );
              })}
            </div>
          )}
        </section>

        <section className="card space-y-3">
          <h2 className="font-display text-lg text-ink flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-brass text-white text-sm flex items-center justify-center">2</span>
            Your details
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="label">Name</label>
              <input className="input" value={form.customer_name} onChange={(e) => set("customer_name", e.target.value)} required />
            </div>
            <div>
              <label className="label">Mobile number</label>
              <input className="input" type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="91XXXXXXXXXX" required />
            </div>
          </div>
          <div>
            <label className="label">Visit address</label>
            <textarea className="input" rows={2} value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="House / street / area where our agent should come" required />
          </div>
          <div>
            <label className="label">Google location</label>
            <div className="flex gap-2">
              <input
                className="input"
                value={form.google_location}
                onChange={(e) => set("google_location", e.target.value)}
                placeholder="Paste a Google Maps link, or use the button →"
              />
              <button type="button" onClick={shareMyLocation} disabled={locating} className="btn-secondary whitespace-nowrap">
                {locating ? "Locating…" : "📍 My location"}
              </button>
            </div>
          </div>
        </section>

        <section className="card space-y-3">
          <h2 className="font-display text-lg text-ink flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-brass text-white text-sm flex items-center justify-center">3</span>
            When should our agent visit?
          </h2>
          <div>
            <label className="label">Preferred date</label>
            <input className="input" type="date" min={today} value={form.preferred_date} onChange={(e) => set("preferred_date", e.target.value)} required />
          </div>
          <div>
            <label className="label">Visit slot</label>
            <div className="grid grid-cols-3 gap-2">
              {SLOTS.map((s) => (
                <button
                  type="button"
                  key={s.value}
                  onClick={() => set("preferred_slot", s.value)}
                  className={`rounded border px-2 py-3 text-center transition-colors ${
                    form.preferred_slot === s.value ? "border-brass bg-brass/10 text-brass-dark" : "border-line bg-card text-ink hover:border-brass/50"
                  }`}
                >
                  <span className="block text-sm font-medium">{s.label}</span>
                  <span className="block text-[11px] text-muted">{s.hint}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="label">Anything else we should know? (optional)</label>
            <input className="input" value={form.notes} onChange={(e) => set("notes", e.target.value)} />
          </div>
        </section>

        {error && <p className="text-thread text-sm">{error}</p>}
        <button type="submit" disabled={busy} className="btn-primary w-full py-3 text-base">
          {busy ? "Booking…" : "Book appointment"}
        </button>
      </form>

      {mine.length > 0 && (
        <section className="card">
          <h2 className="font-display text-lg text-ink mb-3">Your appointments</h2>
          <div className="space-y-2">
            {mine.map((a) => {
              const names = clothsOf(a);
              return (
                <div key={a.id} className="flex justify-between gap-3 text-sm border-b border-line last:border-0 pb-2 last:pb-0">
                  <span>
                    {a.preferred_date} · {a.preferred_slot}
                    {names.length > 0 && <span className="text-muted"> · {names.join(", ")}</span>}
                  </span>
                  <span className={`capitalize font-medium ${STATUS_STYLE[a.status] || ""}`}>{a.status}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
