"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, BookOpenCheck, Sparkles, ShieldCheck, Star } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { saveProfile, loadProfile } from "@/lib/userStore";
import { PERSONAS, type DemoPersona } from "@/lib/personas";
import type { UserProfile } from "@/lib/types";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [mode, setMode] = useState<"signup" | "signin">("signup");

  function startOnboarding(profile: {
    name: string;
    email: string;
    birthday: string;
  }) {
    // Persist a minimal profile so the header and onboarding can read it.
    // Onboarding will fill in the rest.
    const existing = loadProfile();
    const draft: UserProfile = {
      name: profile.name,
      email: profile.email,
      birthday: profile.birthday,
      travelGoals: existing?.travelGoals ?? [],
      dreamDestinations: existing?.dreamDestinations ?? [],
      homeAirport: existing?.homeAirport ?? "",
      currentCards: existing?.currentCards ?? [],
      spendCategories: existing?.spendCategories ?? [],
      travelFrequency: existing?.travelFrequency ?? "occasional",
      experience: existing?.experience ?? "beginner",
      preferredBrands: existing?.preferredBrands ?? [],
      inferredIntent: existing?.inferredIntent ?? "learning",
      savedSlugs: existing?.savedSlugs ?? [],
      createdAt: existing?.createdAt ?? new Date().toISOString(),
    };
    saveProfile(draft);
    router.push("/onboarding");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !birthday) return;
    startOnboarding({
      name: name.trim(),
      email: email.trim(),
      birthday,
    });
  }

  // Load a fully built persona and skip onboarding — used by the sign-in
  // tab so demo viewers can jump straight to a personalized dashboard.
  function loadPersona(p: DemoPersona) {
    saveProfile(p.profile);
    router.push("/dashboard");
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-7 py-12 sm:px-7 md:grid-cols-2 md:py-20 lg:px-8">
          {/* LEFT — benefits */}
          <div className="bg-tpg-navy p-8 text-white md:p-10">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-white/10 px-3 py-1 text-xs font-semibold text-white">
              <Sparkles className="h-3.5 w-3.5" />
              Join The Points Guy
            </span>
            <h1 className="mt-4 text-2xl font-bold tracking-tight leading-tight sm:text-3xl md:text-4xl">
              Unlock a personalized travel rewards experience.
            </h1>
            <p className="mt-3 text-white/80">
              Free to join. Takes about 60 seconds. We&apos;ll use your answers
              to power your For You page — and nothing else.
            </p>
            <ul className="mt-8 space-y-4">
              <Benefit
                icon={<Star className="h-4 w-4" />}
                title="Better recommendations"
                body="Personalized article, card, and offer recommendations tailored to your goals."
              />
              <Benefit
                icon={<BookOpenCheck className="h-4 w-4" />}
                title="Beginner or advanced paths"
                body="A learning track tuned to your experience level — never under or over-coached."
              />
              <Benefit
                icon={<ShieldCheck className="h-4 w-4" />}
                title="Private by design"
                body="We never share your information. You stay in control of every preference."
              />
            </ul>
          </div>

          {/* RIGHT — form */}
          <div className="flex items-center">
            <form
              onSubmit={handleSubmit}
              className="w-full border border-tpg-border bg-white p-8 md:p-10"
            >
              <div className="flex items-center gap-1 border-b border-tpg-border">
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className={`flex-1 border-b-2 px-4 py-3 text-sm font-semibold transition ${
                    mode === "signup"
                      ? "border-tpg-blue text-tpg-ink"
                      : "border-transparent text-tpg-gray-500 hover:text-tpg-blue"
                  }`}
                >
                  Create account
                </button>
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className={`flex-1 border-b-2 px-4 py-3 text-sm font-semibold transition ${
                    mode === "signin"
                      ? "border-tpg-blue text-tpg-ink"
                      : "border-transparent text-tpg-gray-500 hover:text-tpg-blue"
                  }`}
                >
                  Sign in
                </button>
              </div>

              <h2 className="mt-6 text-2xl font-bold tracking-tight text-tpg-ink">
                {mode === "signup" ? "Create your free account" : "Welcome back"}
              </h2>
              <p className="mt-1 text-sm text-tpg-gray-500">
                {mode === "signup"
                  ? "Just a name and email — we'll keep it simple."
                  : "Pick a pre-built profile and jump straight into a personalized dashboard."}
              </p>

              {mode === "signup" ? (
                <div className="mt-6 space-y-4">
                  <Field
                    label="Full name"
                    value={name}
                    onChange={setName}
                    placeholder="Enter your full name"
                  />
                  <Field
                    label="Email address"
                    value={email}
                    onChange={setEmail}
                    placeholder="you@example.com"
                    type="email"
                  />
                  <Field
                    label="Birthday"
                    value={birthday}
                    onChange={setBirthday}
                    placeholder=""
                    type="date"
                  />
                  <p className="text-xs text-tpg-gray-500">
                    By creating an account, you agree to our prototype Terms of
                    Use and Privacy Policy.
                  </p>
                  <button
                    type="submit"
                    disabled={!name.trim() || !email.trim() || !birthday}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-tpg-blue px-4 py-3 text-sm font-semibold text-white shadow hover:bg-tpg-navy disabled:opacity-40"
                  >
                    Continue <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="mt-6 space-y-3">
                  {PERSONAS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => loadPersona(p)}
                      className="flex w-full items-start justify-between gap-4 border border-tpg-border px-4 py-3 text-left transition hover:border-tpg-blue hover:bg-tpg-gray-50"
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-tpg-blue-soft text-xl">
                          {p.emoji}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-tpg-ink">
                            {p.profile.name} · {p.label}
                          </p>
                          <p className="line-clamp-2 text-xs text-tpg-gray-500">
                            {p.description}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-tpg-gray-500" />
                    </button>
                  ))}
                  <p className="pt-2 text-center text-xs text-tpg-gray-500">
                    Pre-built profiles for the prototype demo — skips onboarding.
                  </p>
                </div>
              )}

              <p className="mt-6 text-center text-xs text-tpg-gray-500">
                Already have an account?{" "}
                <Link href="/dashboard" className="font-semibold text-tpg-blue">
                  Open dashboard
                </Link>
              </p>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: Readonly<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
}>) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-tpg-gray-700">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5 w-full border border-tpg-border px-4 py-3 text-sm text-tpg-ink outline-none focus:border-tpg-blue focus:ring-2 focus:ring-tpg-blue/20"
      />
    </label>
  );
}

function Benefit({
  icon,
  title,
  body,
}: Readonly<{
  icon: React.ReactNode;
  title: string;
  body: string;
}>) {
  return (
    <li className="flex items-start gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-tpg-navy">
        {icon}
      </span>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-sm text-white/70">{body}</p>
      </div>
    </li>
  );
}
