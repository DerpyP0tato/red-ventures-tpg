"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, ShieldCheck, Sparkles } from "lucide-react";
import {
  BRAND_OPTIONS,
  COMMON_CARDS,
  DREAM_DEST_OPTIONS,
  SPEND_OPTIONS,
  TRAVEL_GOAL_OPTIONS,
} from "@/lib/mockData";
import type { Tag, UserProfile } from "@/lib/types";
import { loadProfile, saveProfile } from "@/lib/userStore";
import { Logo } from "@/components/Logo";
import { inferIntent } from "@/lib/personalization";

const STEPS = [
  "Travel goals",
  "Dream destinations",
  "Home base",
  "Current cards",
  "Spend & experience",
  "Brands",
] as const;

const FREQUENCIES: UserProfile["travelFrequency"][] = [
  "rare",
  "occasional",
  "frequent",
  "road-warrior",
];
const FREQ_LABEL: Record<UserProfile["travelFrequency"], string> = {
  rare: "Once a year or less",
  occasional: "A few trips a year",
  frequent: "Monthly trips",
  "road-warrior": "Always on the road",
};

const EXPERIENCE: UserProfile["experience"][] = ["beginner", "intermediate", "advanced"];
const EXP_LABEL: Record<UserProfile["experience"], { title: string; body: string }> = {
  beginner: { title: "Beginner", body: "New to points — show me the basics." },
  intermediate: { title: "Intermediate", body: "I've earned some bonuses; ready to optimize." },
  advanced: { title: "Advanced", body: "I chase sweet spots and stack transfer bonuses." },
};

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Local-only working copy; only flushed to localStorage on Finish.
  const [travelGoals, setTravelGoals] = useState<string[]>([]);
  const [dreamDestinations, setDreamDestinations] = useState<Tag[]>([]);
  const [dreamDestinationsOther, setDreamDestinationsOther] = useState("");
  const [showOtherSoon, setShowOtherSoon] = useState(false);
  const [homeAirport, setHomeAirport] = useState("");
  const [travelFrequency, setTravelFrequency] = useState<UserProfile["travelFrequency"]>("occasional");
  const [currentCards, setCurrentCards] = useState<string[]>([]);
  const [spendCategories, setSpendCategories] = useState<Tag[]>([]);
  const [experience, setExperience] = useState<UserProfile["experience"]>("beginner");
  const [preferredBrands, setPreferredBrands] = useState<Tag[]>([]);

  useEffect(() => {
    const p = loadProfile();
    if (!p) {
      // Without an account we can't onboard — bounce back to signup
      router.replace("/signup");
      return;
    }
    setProfile(p);
    setTravelGoals(p.travelGoals);
    setDreamDestinations(p.dreamDestinations);
    setDreamDestinationsOther((p.dreamDestinationsOther ?? []).join(", "));
    setHomeAirport(p.homeAirport);
    setTravelFrequency(p.travelFrequency);
    setCurrentCards(p.currentCards);
    setSpendCategories(p.spendCategories);
    setExperience(p.experience);
    setPreferredBrands(p.preferredBrands);
  }, [router]);

  const progress = useMemo(() => ((step + 1) / STEPS.length) * 100, [step]);
  const canAdvance = useMemo(() => {
    switch (step) {
      case 0:
        return travelGoals.length > 0;
      case 1:
        return dreamDestinations.length > 0;
      case 2:
        return homeAirport.trim().length > 0;
      case 3:
        return true; // current cards optional
      case 4:
        return spendCategories.length > 0;
      case 5:
        return true; // brands optional
      default:
        return true;
    }
  }, [
    step,
    travelGoals,
    dreamDestinations,
    dreamDestinationsOther,
    homeAirport,
    spendCategories,
  ]);

  function next() {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      finish();
    }
  }

  function back() {
    if (step > 0) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function finish() {
    if (!profile) return;
    const updated: UserProfile = {
      ...profile,
      travelGoals,
      dreamDestinations,
      dreamDestinationsOther: dreamDestinationsOther
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      homeAirport,
      currentCards,
      spendCategories,
      travelFrequency,
      experience,
      preferredBrands,
      inferredIntent: "learning", // placeholder — overwritten next line
    };
    updated.inferredIntent = inferIntent(updated);
    saveProfile(updated);
    router.push("/dashboard");
  }

  if (!profile) return null;

  return (
    <main className="flex min-h-screen flex-col bg-tpg-gray-50">
      {/* Mini-header */}
      <header className="border-b border-tpg-gray-100 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-7 py-4 sm:px-7">
          <Link href="/">
            <Logo />
          </Link>
          <p className="text-xs text-tpg-gray-500">
            Step {step + 1} of {STEPS.length}
          </p>
        </div>
        <div className="h-1 w-full bg-tpg-gray-100">
          <div
            className="h-full bg-tpg-blue transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      <div className="mx-auto w-full max-w-3xl flex-1 px-7 py-10 sm:px-7">
        <p className="text-xs font-bold uppercase tracking-widest text-tpg-blue">
          {STEPS[step]}
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-tpg-ink sm:text-3xl md:text-4xl">
          {questionFor(step)}
        </h1>
        <p className="mt-2 text-sm text-tpg-gray-500">
          {subtitleFor(step)}
        </p>

        <div className="mt-8">
          {step === 0 && (
            <MultiPick
              options={TRAVEL_GOAL_OPTIONS}
              selected={travelGoals}
              setSelected={setTravelGoals}
            />
          )}
          {step === 1 && (
            <>
              <MultiPick
                options={DREAM_DEST_OPTIONS}
                selected={dreamDestinations}
                setSelected={(v) => setDreamDestinations(v as Tag[])}
              />
              <label className="mt-6 block">
                <span className="text-xs font-semibold uppercase tracking-wider text-tpg-gray-700">
                  Other
                </span>
                <input
                  type="text"
                  value={dreamDestinationsOther}
                  readOnly
                  onFocus={() => setShowOtherSoon(true)}
                  onClick={() => setShowOtherSoon(true)}
                  placeholder="e.g. Patagonia, Morocco, New Zealand"
                  className="mt-1.5 w-full cursor-not-allowed rounded-xl border border-tpg-border bg-tpg-gray-50 px-4 py-3 text-sm text-tpg-gray-500 outline-none"
                />
                {showOtherSoon ? (
                  <p className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-tpg-blue-soft px-2.5 py-1 text-xs font-semibold text-tpg-blue">
                    <Sparkles className="h-3 w-3" /> Feature coming soon — pick
                    from the options above for now.
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-tpg-gray-500">
                    Free-text destinations are coming soon.
                  </p>
                )}
              </label>
            </>
          )}
          {step === 2 && (
            <div className="space-y-6">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wider text-tpg-gray-700">
                  Home airport
                </span>
                <input
                  type="text"
                  value={homeAirport}
                  onChange={(e) => setHomeAirport(e.target.value.toUpperCase())}
                  maxLength={4}
                  placeholder="e.g. JFK, SFO, ORD"
                  className="mt-1.5 w-full rounded-xl border border-tpg-gray-200 bg-white px-4 py-3 text-sm uppercase tracking-widest text-tpg-navy outline-none focus:border-tpg-blue focus:ring-2 focus:ring-tpg-blue/20"
                />
                <p className="mt-1 text-xs text-tpg-gray-500">
                  We use this only to surface relevant award routings.
                </p>
              </label>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-tpg-gray-700">
                  How often do you travel?
                </p>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {FREQUENCIES.map((f) => (
                    <button
                      key={f}
                      onClick={() => setTravelFrequency(f)}
                      className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                        travelFrequency === f
                          ? "border-tpg-blue bg-tpg-blue-soft text-tpg-navy"
                          : "border-tpg-gray-200 bg-white hover:border-tpg-blue"
                      }`}
                    >
                      <p className="font-semibold capitalize">{f.replace("-", " ")}</p>
                      <p className="text-xs text-tpg-gray-500">{FREQ_LABEL[f]}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          {step === 3 && (
            <div>
              <div className="grid gap-2">
                {COMMON_CARDS.map((c) => (
                  <ToggleRow
                    key={c.id}
                    label={c.label}
                    selected={currentCards.includes(c.id)}
                    onClick={() => toggle(currentCards, c.id, setCurrentCards)}
                  />
                ))}
              </div>
              <button
                onClick={() => {
                  setCurrentCards([]);
                  next();
                }}
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-tpg-border bg-white px-5 py-2.5 text-sm font-semibold text-tpg-ink transition hover:border-tpg-blue hover:text-tpg-blue"
              >
                I don&apos;t have any rewards cards yet
              </button>
            </div>
          )}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-tpg-gray-700">
                  Top spend categories
                </p>
                <p className="text-xs text-tpg-gray-500">Pick everything that applies.</p>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {SPEND_OPTIONS.map((s) => (
                    <BigToggle
                      key={s.id}
                      emoji={s.emoji}
                      label={s.label}
                      selected={spendCategories.includes(s.id)}
                      onClick={() => toggle(spendCategories, s.id, (v) => setSpendCategories(v as Tag[]))}
                    />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-tpg-gray-700">
                  Your points experience
                </p>
                <div className="mt-2 grid gap-2 sm:grid-cols-3">
                  {EXPERIENCE.map((e) => (
                    <button
                      key={e}
                      onClick={() => setExperience(e)}
                      className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                        experience === e
                          ? "border-tpg-blue bg-tpg-blue-soft text-tpg-navy"
                          : "border-tpg-gray-200 bg-white hover:border-tpg-blue"
                      }`}
                    >
                      <p className="font-semibold">{EXP_LABEL[e].title}</p>
                      <p className="text-xs text-tpg-gray-500">{EXP_LABEL[e].body}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          {step === 5 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-tpg-gray-700">
                Favorite airlines & hotel chains
              </p>
              <p className="text-xs text-tpg-gray-500">
                Optional — we&apos;ll use this to prioritize relevant deals & cards.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {BRAND_OPTIONS.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => toggle(preferredBrands, b.id, (v) => setPreferredBrands(v as Tag[]))}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      preferredBrands.includes(b.id)
                        ? "border-tpg-blue bg-tpg-blue text-white"
                        : "border-tpg-gray-200 bg-white text-tpg-gray-700 hover:border-tpg-blue"
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>

              <div className="mt-8 rounded-2xl border border-tpg-gray-100 bg-white p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-tpg-blue">
                  <ShieldCheck className="h-4 w-4" /> Privacy-conscious by design
                </div>
                <p className="mt-1 text-xs text-tpg-gray-500">
                  We only use these answers to power your For You page. You can
                  edit or reset your preferences any time from the dashboard.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="sticky bottom-0 border-t border-tpg-gray-100 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-7 py-4 sm:px-7">
          <button
            onClick={back}
            disabled={step === 0}
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-tpg-gray-700 hover:bg-tpg-gray-50 disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <button
            onClick={next}
            disabled={!canAdvance}
            className="inline-flex items-center gap-1.5 rounded-full bg-tpg-blue px-6 py-3 text-sm font-semibold text-white shadow hover:bg-tpg-navy disabled:opacity-40"
          >
            {step === STEPS.length - 1 ? "Build my dashboard" : "Continue"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </footer>
    </main>
  );
}

function questionFor(step: number) {
  return [
    "What do you want from points & miles?",
    "Where do you dream of going?",
    "Where are you flying from?",
    "Which credit cards do you have?",
    "How do you spend & where are you at?",
    "Which brands do you fly or stay with?",
  ][step];
}

function subtitleFor(step: number) {
  return [
    "Pick everything that resonates — these become the goals of your For You page.",
    "Multi-select. We'll surface award sweet spots and stay tips for each.",
    "Your home airport helps us recommend realistic award routings.",
    "Optional — but the more you tell us, the better your card matches.",
    "Spend tells us which multipliers will actually move the needle for you.",
    "Optional. Loyalty matters — we'll factor your favorites into matches.",
  ][step];
}

function toggle<T>(arr: T[], v: T, set: (next: T[]) => void) {
  if (arr.includes(v)) set(arr.filter((x) => x !== v));
  else set([...arr, v]);
}

function MultiPick<T extends string>({
  options,
  selected,
  setSelected,
}: {
  options: { id: T; label: string; emoji?: string }[];
  selected: T[];
  setSelected: (v: T[]) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map((o) => (
        <BigToggle
          key={o.id}
          emoji={o.emoji}
          label={o.label}
          selected={selected.includes(o.id)}
          onClick={() => toggle(selected, o.id, setSelected)}
        />
      ))}
    </div>
  );
}

function BigToggle({
  emoji,
  label,
  selected,
  onClick,
}: {
  emoji?: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 text-left transition ${
        selected
          ? "border-tpg-blue bg-tpg-blue-soft"
          : "border-tpg-gray-200 bg-white hover:border-tpg-blue"
      }`}
    >
      <span className="flex items-center gap-3 text-sm font-semibold text-tpg-navy">
        {emoji && <span className="text-xl leading-none">{emoji}</span>}
        {label}
      </span>
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-full border ${
          selected ? "border-tpg-blue bg-tpg-blue text-white" : "border-tpg-gray-200"
        }`}
      >
        {selected && <Check className="h-3 w-3" />}
      </span>
    </button>
  );
}

function ToggleRow({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
        selected
          ? "border-tpg-blue bg-tpg-blue-soft text-tpg-navy"
          : "border-tpg-gray-200 bg-white hover:border-tpg-blue"
      }`}
    >
      <span className="text-sm font-medium">{label}</span>
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-full border ${
          selected ? "border-tpg-blue bg-tpg-blue text-white" : "border-tpg-gray-200"
        }`}
      >
        {selected && <Check className="h-3 w-3" />}
      </span>
    </button>
  );
}
