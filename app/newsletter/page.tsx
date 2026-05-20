"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Check, CheckCircle2, ChevronRight, Eye, Mail, Plus, Sparkles } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  loadNewsletterSections,
  saveNewsletterSections,
  useProfile,
} from "@/lib/userStore";
import {
  NEWSLETTER_SECTIONS,
  defaultSelectedSectionIds,
  scoreAllSections,
  type NewsletterSection,
  type ScoredSection,
} from "@/lib/newsletterSections";
import { intentLabel } from "@/lib/personalization";

// Group ordering mirrors the HBR pattern — Editor's Pick at top, then
// Most Popular, then audience-specific groups, then Special Series.
const GROUP_ORDER: Array<{
  id: NewsletterSection["group"];
  label: string;
  helper?: string;
}> = [
  { id: "popular", label: "Most Popular" },
  { id: "beginner", label: "If you're new to points" },
  { id: "advanced", label: "Advanced strategy" },
  { id: "special", label: "Special Series" },
];

const FILTERS = ["All", "Daily", "Weekly", "Biweekly", "Monthly"] as const;

export default function NewsletterPage() {
  const profile = useProfile();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [hydrated, setHydrated] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  // Score every section against the profile (cheap — runs in-browser)
  const scored = useMemo<ScoredSection[]>(
    () => (profile ? scoreAllSections(profile) : []),
    [profile]
  );

  // On first load: if the user has saved choices, use them; otherwise
  // pre-select the sections our model recommends.
  useEffect(() => {
    if (!profile) return;
    const stored = loadNewsletterSections();
    if (stored && stored.length > 0) {
      setSelectedIds(stored);
    } else {
      setSelectedIds(defaultSelectedSectionIds(profile));
    }
    setHydrated(true);
  }, [profile]);

  // Auto-persist on change (after first hydration)
  useEffect(() => {
    if (!hydrated) return;
    saveNewsletterSections(selectedIds);
  }, [selectedIds, hydrated]);

  function toggle(id: string) {
    setSelectedIds((curr) =>
      curr.includes(id) ? curr.filter((x) => x !== id) : [...curr, id]
    );
  }

  if (!profile) {
    return (
      <>
        <Header />
        <main className="flex min-h-[calc(100vh-72px)] flex-col items-center justify-center bg-white p-10 text-center">
          <Mail className="h-10 w-10 text-tpg-gray-200" />
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-tpg-ink">
            Customize your newsletter
          </h1>
          <p className="mt-1 max-w-md text-sm text-tpg-gray-500">
            Sign in to build a personalized weekly briefing.
          </p>
          <Link
            href="/signup"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-tpg-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-tpg-navy"
          >
            Create your free account
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const scoredById = new Map(scored.map((s) => [s.section.id, s]));
  const editorsPick = scored.find((s) => s.section.isEditorsPick);

  // The "Recommended for You" section: top 3 model-picked sections that
  // the user hasn't already added. Empty if everything is already on.
  const personalRecs = scored
    .filter(
      (s) =>
        !s.section.isEditorsPick &&
        s.score >= 3 &&
        !selectedIds.includes(s.section.id)
    )
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const filteredByGroup = (group: NewsletterSection["group"]) =>
    scored.filter(
      (s) =>
        s.section.group === group &&
        (filter === "All" || s.section.frequency === filter)
    );

  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        {/* Hero */}
        <section className="border-b border-tpg-border bg-white">
          <div className="mx-auto max-w-5xl px-7 py-10 sm:px-7 md:py-14 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-tpg-ink sm:text-4xl md:text-5xl">
              Build your Points Guy Briefing
            </h1>
            <p className="mt-3 max-w-2xl text-tpg-gray-500">
              One newsletter, your choice of sections. Toggle the modules you
              want, and we&apos;ll assemble a single weekly email tailored to
              your goals — not a flood of separate subscriptions.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs">
              <SummaryPill
                label={`${selectedIds.length} sections selected`}
                tone="navy"
              />
              <SummaryPill
                label="Delivered every Tuesday"
                tone="ghost"
              />
              <SummaryPill
                label="Updated automatically as your preferences change"
                tone="ghost"
              />
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-5xl px-7 py-10 sm:px-7 lg:px-8">
          {/* PERSONALIZED RECOMMENDATION SECTION */}
          {personalRecs.length > 0 && (
            <section className="mb-10 border-y border-tpg-border bg-bg-cream p-6 md:p-8">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-tpg-blue">
                <Sparkles className="h-3.5 w-3.5" /> Recommended for you
              </div>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-tpg-ink">
                Three sections we think you&apos;ll want.
              </h2>
              <p className="text-sm text-tpg-gray-500">
                Based on your inferred intent (
                <span className="font-semibold text-tpg-ink">
                  {intentLabel(profile.inferredIntent).toLowerCase()}
                </span>
                ) and your onboarding answers.
              </p>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {personalRecs.map((s) => (
                  <RecCard
                    key={s.section.id}
                    scored={s}
                    onAdd={() => toggle(s.section.id)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* EDITOR'S PICK ROW */}
          {editorsPick && (
            <SectionRow
              scored={editorsPick}
              selected={selectedIds.includes(editorsPick.section.id)}
              onToggle={() => toggle(editorsPick.section.id)}
              isEditorsPick
            />
          )}

          {/* FILTER BAR */}
          <div className="mt-6 flex items-center justify-between border-b border-tpg-border pb-4">
            <p className="text-sm text-tpg-gray-500">
              Toggle sections to include in your weekly newsletter.
            </p>
            <label className="flex items-center gap-2 text-xs font-semibold text-tpg-gray-700">
              Filter:
              <select
                value={filter}
                onChange={(e) =>
                  setFilter(e.target.value as (typeof FILTERS)[number])
                }
                className="rounded-md border border-tpg-gray-200 px-2 py-1 text-xs"
              >
                {FILTERS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* GROUPED LIST */}
          {GROUP_ORDER.map(({ id, label }) => {
            const items = filteredByGroup(id);
            if (items.length === 0) return null;
            return (
              <div key={id} className="mt-8">
                <p className="text-xs font-bold uppercase tracking-widest text-tpg-gray-500">
                  {label}
                </p>
                <div className="mt-2 divide-y divide-tpg-gray-100">
                  {items.map((s) => (
                    <SectionRow
                      key={s.section.id}
                      scored={s}
                      selected={selectedIds.includes(s.section.id)}
                      onToggle={() => toggle(s.section.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}

          {/* PREVIEW PANEL — what their newsletter will contain */}
          <section className="mt-14 border border-tpg-border bg-white p-6 md:p-8">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-tpg-gray-500">
              <Mail className="h-4 w-4" />
              Newsletter preview
            </div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-tpg-ink">
              Your Tuesday briefing will include:
            </h2>
            {selectedIds.length === 0 ? (
              <p className="mt-3 text-sm text-tpg-gray-500">
                Pick at least one section above to start building your
                briefing.
              </p>
            ) : (
              <ol className="mt-5 space-y-3">
                {selectedIds.map((id, i) => {
                  const s = scoredById.get(id);
                  if (!s) return null;
                  return (
                    <li
                      key={id}
                      className="flex items-start gap-3 border border-tpg-border bg-white p-3"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-tpg-blue text-xs font-bold text-white">
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-tpg-ink">
                          {s.section.title}
                        </p>
                        <p className="text-xs text-tpg-gray-500">
                          {s.section.frequency} · {s.section.description}
                        </p>
                      </div>
                      <button
                        onClick={() => toggle(id)}
                        className="text-xs font-semibold text-tpg-gray-500 hover:text-tpg-blue"
                      >
                        Remove
                      </button>
                    </li>
                  );
                })}
              </ol>
            )}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  // Persistence already happens automatically — the button
                  // just gives the user a tactile confirmation moment.
                  saveNewsletterSections(selectedIds);
                  setSavedAt(Date.now());
                }}
                className="inline-flex items-center gap-2 rounded-full bg-tpg-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-tpg-navy"
              >
                Save preferences
              </button>
              {savedAt && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" /> Saved ·{" "}
                  {new Date(savedAt).toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              )}
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1 text-sm font-semibold text-tpg-blue hover:underline"
              >
                Back to dashboard <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <p className="mt-2 text-xs text-tpg-gray-500">
              Changes also save automatically as you toggle sections.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

// --- Sub-components below ---

function SummaryPill({
  label,
  tone,
}: Readonly<{
  label: string;
  tone: "navy" | "ghost";
}>) {
  const cls =
    tone === "navy"
      ? "bg-tpg-blue text-white"
      : "border border-tpg-border bg-white text-tpg-gray-700";
  return (
    <span className={`inline-flex items-center rounded-md px-3 py-1.5 text-xs font-semibold ${cls}`}>
      {label}
    </span>
  );
}

function SectionRow({
  scored,
  selected,
  onToggle,
  isEditorsPick = false,
}: Readonly<{
  scored: ScoredSection;
  selected: boolean;
  onToggle: () => void;
  isEditorsPick?: boolean;
}>) {
  const { section, reasons, score } = scored;

  return (
    <div
      className={`flex flex-col gap-3 py-5 sm:flex-row sm:items-start sm:gap-4 ${
        isEditorsPick
          ? "border-y border-tpg-border bg-bg-cream px-5"
          : ""
      }`}
    >
      {/* Icon + body — kept together on mobile via display:contents at sm+ */}
      <div className="flex items-start gap-4 sm:contents">
        {/* Icon tile */}
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${section.color} text-2xl shadow-sm`}
        >
          <span className="drop-shadow">{section.icon}</span>
        </div>

        {/* Body */}
        <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-tpg-gray-500">
          {isEditorsPick ? "Editor's Pick · " : ""}
          {section.frequency}
        </p>
        <h3 className="mt-0.5 text-lg font-bold tracking-tight text-tpg-ink">
          {section.title}
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-tpg-gray-700">
          {section.description}
        </p>
        {reasons.length > 0 && (
          <p className="mt-2 text-[11px] font-semibold text-tpg-blue">
            <Sparkles className="mr-1 inline h-3 w-3" />
            Match score {score} ·{" "}
            <span className="font-normal text-tpg-gray-500">
              {reasons.join(" · ")}
            </span>
          </p>
        )}
      </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3 sm:ml-auto sm:shrink-0 sm:gap-4">
        <button className="hidden text-sm font-semibold text-tpg-gray-700 hover:text-tpg-blue sm:inline-flex sm:items-center sm:gap-1">
          <Eye className="h-4 w-4" /> Preview
        </button>
        <button
          onClick={onToggle}
          className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
            selected
              ? "border border-tpg-blue bg-tpg-blue text-white"
              : "border border-tpg-border bg-white text-tpg-ink hover:border-tpg-blue"
          }`}
        >
          {selected ? (
            <>
              <Check className="h-4 w-4" /> Added
            </>
          ) : (
            <>
              Add <Plus className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function RecCard({
  scored,
  onAdd,
}: Readonly<{ scored: ScoredSection; onAdd: () => void }>) {
  const { section, reasons, score } = scored;
  return (
    <div className="flex flex-col gap-3 border border-tpg-border bg-white p-4">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-br ${section.color} text-xl`}
        >
          {section.icon}
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-tpg-gray-500">
            {section.frequency}
          </p>
          <p className="text-sm font-semibold text-tpg-ink">{section.title}</p>
        </div>
      </div>
      <p className="line-clamp-2 text-xs text-tpg-gray-500">
        {section.description}
      </p>
      <p className="text-[11px] font-semibold text-tpg-blue">
        Why: {reasons[0] ?? `aligned with your profile`} · score {score}
      </p>
      <button
        onClick={onAdd}
        className="inline-flex items-center justify-center gap-1.5 rounded-full bg-tpg-blue px-4 py-2 text-xs font-semibold text-white hover:bg-tpg-navy"
      >
        Add to my briefing <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

// Suppress unused warning — re-export type so it can be tree-shaken cleanly
export type { NewsletterSection };
