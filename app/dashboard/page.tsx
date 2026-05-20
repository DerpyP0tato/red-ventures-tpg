"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Bookmark,
  Edit3,
  Plane,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArticleCard } from "@/components/ArticleCard";
import { CardModule } from "@/components/CardModule";
import { DealCard } from "@/components/DealCard";
import { DestinationCard } from "@/components/DestinationCard";
import { ARTICLES } from "@/lib/mockData";
import { saveProfile, useProfile } from "@/lib/userStore";
import {
  inferIntent,
  learningPath,
  nextBestAction,
  recommendArticles,
  recommendCards,
  recommendDeals,
  recommendDestinations,
} from "@/lib/personalization";
import type { UserProfile } from "@/lib/types";

const ARTICLES_COLLAPSED_COUNT = 4;
const CARDS_COLLAPSED_COUNT = 3;
const DESTINATIONS_COLLAPSED_COUNT = 3;

export default function DashboardPage() {
  const profile = useProfile();
  const router = useRouter();
  const [articlesExpanded, setArticlesExpanded] = useState(false);
  const [cardsExpanded, setCardsExpanded] = useState(false);
  const [destsExpanded, setDestsExpanded] = useState(false);

  // Anonymous visitors get pushed back to signup
  useEffect(() => {
    if (typeof window === "undefined") return;
    const t = setTimeout(() => {
      if (!profile) router.replace("/signup");
    }, 200);
    return () => clearTimeout(t);
  }, [profile, router]);

  const articles = useMemo(() => (profile ? recommendArticles(profile, 12) : []), [profile]);
  const cards = useMemo(() => (profile ? recommendCards(profile, 6) : []), [profile]);
  const deals = useMemo(() => (profile ? recommendDeals(profile, 3) : []), [profile]);
  const dests = useMemo(() => (profile ? recommendDestinations(profile, 6) : []), [profile]);
  const path = useMemo(() => (profile ? learningPath(profile) : null), [profile]);
  const nba = useMemo(() => (profile ? nextBestAction(profile) : null), [profile]);
  const savedItems = useMemo(
    () =>
      profile
        ? profile.savedSlugs
            .map((slug) => ARTICLES.find((a) => a.slug === slug))
            .filter((a): a is (typeof ARTICLES)[number] => !!a)
        : [],
    [profile]
  );

  if (!profile) {
    return (
      <>
        <Header />
        <main className="flex min-h-[calc(100vh-72px)] items-center justify-center">
          <p className="text-tpg-gray-500">Loading your dashboard…</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        {/* WELCOME STRIP */}
        <section className="border-b border-tpg-border bg-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-7 py-8 sm:px-7 md:flex-row md:items-end md:justify-between lg:px-8">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-tpg-ink sm:text-3xl md:text-4xl">
                Welcome back, {profile.name?.split(" ")[0] ?? "traveler"}.
              </h1>
              <p className="text-sm text-tpg-gray-500">
                Here&apos;s what&apos;s new in your travel rewards world today.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <Pill label="Home" value={profile.homeAirport || "—"} icon={<Plane className="h-3 w-3" />} />
              <Pill
                label="Experience"
                value={profile.experience}
                icon={<TrendingUp className="h-3 w-3" />}
              />
              <Pill
                label="Goals"
                value={`${profile.travelGoals.length} selected`}
                icon={<Sparkles className="h-3 w-3" />}
              />
              <Link
                href="/onboarding"
                className="inline-flex items-center gap-1 rounded-full border border-tpg-border px-3 py-1.5 font-semibold text-tpg-gray-700 hover:border-tpg-blue hover:text-tpg-blue"
              >
                <Edit3 className="h-3 w-3" /> Edit preferences
              </Link>
            </div>
          </div>
        </section>

        <div className="mx-auto grid max-w-7xl gap-8 px-7 py-10 sm:px-7 lg:grid-cols-[1fr_320px] lg:px-8">
          {/* MAIN */}
          <div className="space-y-12">
            {/* NEXT BEST ACTION */}
            {nba && (
              <section className="border-l-4 border-tpg-blue bg-bg-cream p-6 md:p-8">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-tpg-blue">
                  <Sparkles className="h-3.5 w-3.5" /> Your next best action
                </span>
                <h2 className="mt-3 text-2xl font-bold tracking-tight leading-tight text-tpg-ink md:text-3xl">
                  {nba.title}
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-tpg-gray-700">{nba.subtitle}</p>
                <Link
                  href={nba.href}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-tpg-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-tpg-navy"
                >
                  {nba.cta} <ArrowRight className="h-4 w-4" />
                </Link>
              </section>
            )}

            {/* RECOMMENDED FOR YOU (articles) */}
            <Section
              anchorId="recommended-for-you"
              title="Recommended for you"
              subtitle="Articles matched to your goals, destinations, and intent."
            >
              <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
                {(articlesExpanded
                  ? articles
                  : articles.slice(0, ARTICLES_COLLAPSED_COUNT)
                ).map(({ item, reasons }) => (
                  <ArticleCard key={item.slug} article={item} reasons={reasons} />
                ))}
              </div>
              {articles.length > ARTICLES_COLLAPSED_COUNT && (
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={() => setArticlesExpanded((v) => !v)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-tpg-border bg-white px-5 py-2 text-sm font-semibold text-tpg-ink transition hover:border-tpg-blue hover:text-tpg-blue"
                  >
                    {articlesExpanded
                      ? "Show fewer"
                      : `See ${articles.length - ARTICLES_COLLAPSED_COUNT} more`}
                  </button>
                </div>
              )}
            </Section>

            {/* CARD MATCHES */}
            <Section
              title="Your next best card matches"
              subtitle="Scored against your spend, experience, and current wallet."
            >
              <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                {(cardsExpanded
                  ? cards
                  : cards.slice(0, CARDS_COLLAPSED_COUNT)
                ).map(({ item, reasons }) => (
                  <CardModule
                    key={item.id}
                    card={item}
                    reasons={reasons}
                    matchLabel={item.audience === profile.experience ? "Great match" : "Strong match"}
                  />
                ))}
              </div>
              {cards.length > CARDS_COLLAPSED_COUNT && (
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={() => setCardsExpanded((v) => !v)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-tpg-border bg-white px-5 py-2 text-sm font-semibold text-tpg-ink transition hover:border-tpg-blue hover:text-tpg-blue"
                  >
                    {cardsExpanded
                      ? "Show fewer"
                      : `See ${cards.length - CARDS_COLLAPSED_COUNT} more`}
                  </button>
                </div>
              )}
            </Section>

            {/* DEALS */}
            <Section
              title="Deal alerts for you"
              subtitle="Time-sensitive promotions ranked by relevance."
            >
              {deals.length === 0 ? (
                <p className="border border-dashed border-tpg-border bg-white p-6 text-center text-sm text-tpg-gray-500">
                  No deal alerts match your preferences yet. Update them in onboarding to see more.
                </p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {deals.map(({ item, reasons }) => (
                    <DealCard key={item.id} deal={item} reasons={reasons} />
                  ))}
                </div>
              )}
            </Section>

            {/* DESTINATIONS */}
            <Section
              title="Destinations you'd love"
              subtitle="Trip ideas tied to your dream destinations and points strategy."
            >
              {dests.length === 0 ? (
                <p className="border border-dashed border-tpg-border bg-white p-6 text-center text-sm text-tpg-gray-500">
                  No destination matches yet — add a few dream destinations in onboarding.
                </p>
              ) : (
                <>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {(destsExpanded
                      ? dests
                      : dests.slice(0, DESTINATIONS_COLLAPSED_COUNT)
                    ).map(({ item, reasons }) => (
                      <DestinationCard
                        key={item.id}
                        dest={item}
                        reasons={reasons}
                      />
                    ))}
                  </div>
                  {dests.length > DESTINATIONS_COLLAPSED_COUNT && (
                    <div className="mt-8 flex justify-center">
                      <button
                        onClick={() => setDestsExpanded((v) => !v)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-tpg-border bg-white px-5 py-2 text-sm font-semibold text-tpg-ink transition hover:border-tpg-blue hover:text-tpg-blue"
                      >
                        {destsExpanded
                          ? "Show fewer"
                          : `See ${dests.length - DESTINATIONS_COLLAPSED_COUNT} more`}
                      </button>
                    </div>
                  )}
                </>
              )}
            </Section>

            {/* LEARNING PATH */}
            {path && (
              <Section
                title={`Your ${path.title.toLowerCase()}`}
                subtitle="A guided sequence — knock these out in order."
                action={<ExperienceToggle profile={profile} />}
              >
                <div className="grid gap-4 sm:grid-cols-3">
                  {path.steps.map((article, i) => (
                    <Link
                      key={article.slug}
                      href={`/article/${article.slug}`}
                      className="group flex flex-col gap-3 border-t border-tpg-blue bg-white p-4 transition hover:bg-tpg-gray-50 sm:border-t-2 sm:p-5"
                    >
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-tpg-blue">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-tpg-blue-soft text-tpg-blue">
                          {i + 1}
                        </span>
                        Step {i + 1}
                      </div>
                      <h3 className="text-base font-bold tracking-tight leading-snug text-tpg-ink group-hover:text-tpg-blue">
                        {article.title}
                      </h3>
                      <p className="line-clamp-2 text-xs text-tpg-gray-500">
                        {article.excerpt}
                      </p>
                      <p className="mt-auto text-[11px] font-semibold text-tpg-gray-500">
                        {article.readTime}
                      </p>
                    </Link>
                  ))}
                </div>
              </Section>
            )}

            {/* SAVED */}
            <Section
              title="Saved for later"
              subtitle="Articles you've bookmarked across The Points Guy."
            >
              {savedItems.length === 0 ? (
                <div className="border border-dashed border-tpg-border bg-white p-8 text-center text-sm text-tpg-gray-500">
                  <Bookmark className="mx-auto h-6 w-6 text-tpg-gray-200" />
                  <p className="mt-2">
                    Nothing saved yet. Open any article and tap{" "}
                    <span className="font-semibold text-tpg-ink">Save</span> to
                    bookmark it for later.
                  </p>
                  <a
                    href="#recommended-for-you"
                    className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-tpg-blue hover:underline"
                  >
                    Browse recommended articles ↑
                  </a>
                </div>
              ) : (
                <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
                  {savedItems.map((a) => (
                    <ArticleCard key={a.slug} article={a} size="sm" />
                  ))}
                </div>
              )}
            </Section>
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-6">
            <div className="border border-tpg-border bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-tpg-gray-500">
                Your profile
              </p>
              <div className="mt-3 flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-tpg-blue text-lg font-bold text-white">
                  {profile.name?.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-tpg-ink">{profile.name}</p>
                  <p className="truncate text-xs text-tpg-gray-500">{profile.email}</p>
                </div>
              </div>
              <dl className="mt-4 space-y-2 text-sm">
                <ProfileRow label="Home airport" value={profile.homeAirport || "—"} />
                <ProfileRow
                  label="Travel frequency"
                  value={profile.travelFrequency.replace("-", " ")}
                />
                <ProfileRow label="Experience" value={profile.experience} />
                <ProfileRow
                  label="Dream destinations"
                  value={
                    profile.dreamDestinations.length
                      ? profile.dreamDestinations.join(", ")
                      : "—"
                  }
                />
                <ProfileRow
                  label="Spend"
                  value={profile.spendCategories.length ? profile.spendCategories.join(", ") : "—"}
                />
                <ProfileRow
                  label="Cards"
                  value={profile.currentCards.length ? `${profile.currentCards.length} added` : "None yet"}
                />
              </dl>
              <Link
                href="/onboarding"
                className="mt-4 inline-flex w-full items-center justify-center gap-1 rounded-full bg-tpg-blue py-2 text-sm font-semibold text-white hover:bg-tpg-navy"
              >
                Edit preferences
              </Link>
              <Link
                href="/newsletter"
                className="mt-2 inline-flex w-full items-center justify-center gap-1 rounded-full border border-tpg-border py-2 text-sm font-semibold text-tpg-ink hover:border-tpg-blue hover:text-tpg-blue"
              >
                Customize newsletter
              </Link>
            </div>

            <div className="border border-tpg-border bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-tpg-blue">
                Engagement
              </p>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <Stat value={`${articles.length}`} label="For You" />
                <Stat value={`${profile.savedSlugs.length}`} label="Saved" />
                <Stat value={`${cards.length}`} label="Matches" />
              </div>
              <p className="mt-4 text-xs text-tpg-gray-500">
                You&apos;re in the top 20% of readers this month. Keep it up.
              </p>
            </div>

            <div className="border border-tpg-border bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-tpg-gray-500">
                How we personalize
              </p>
              <p className="mt-2 text-sm text-tpg-gray-700">
                Every module is scored against your onboarding answers and
                inferred intent — and we show our work next to every
                recommendation.
              </p>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Section({
  title,
  subtitle,
  children,
  anchorId,
  action,
}: Readonly<{
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  anchorId?: string;
  action?: React.ReactNode;
}>) {
  return (
    <section id={anchorId} className="scroll-mt-24">
      <div className="flex flex-col gap-3 border-b border-tpg-border pb-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-tpg-ink">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 text-sm text-tpg-gray-500">{subtitle}</p>
          )}
        </div>
        {action}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

const EXPERIENCES: UserProfile["experience"][] = [
  "beginner",
  "intermediate",
  "advanced",
];

function ExperienceToggle({
  profile,
}: Readonly<{ profile: UserProfile }>) {
  function pick(exp: UserProfile["experience"]) {
    if (profile.experience === exp) return;
    const next: UserProfile = { ...profile, experience: exp };
    next.inferredIntent = inferIntent(next);
    saveProfile(next);
  }

  return (
    <div
      role="radiogroup"
      aria-label="Experience level"
      className="inline-flex self-start overflow-hidden rounded-full border border-tpg-border bg-white text-[11px] sm:text-xs"
    >
      {EXPERIENCES.map((exp) => {
        const active = profile.experience === exp;
        return (
          <button
            key={exp}
            role="radio"
            aria-checked={active}
            onClick={() => pick(exp)}
            className={`px-3 py-1 font-semibold capitalize transition sm:px-3.5 sm:py-1.5 ${
              active
                ? "bg-tpg-blue text-white"
                : "text-tpg-gray-700 hover:bg-tpg-gray-50 hover:text-tpg-blue"
            }`}
          >
            {exp}
          </button>
        );
      })}
    </div>
  );
}

function Pill({
  label,
  value,
  icon,
}: Readonly<{
  label: string;
  value: string;
  icon: React.ReactNode;
}>) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-tpg-gray-100 px-3 py-1.5 text-xs font-semibold text-tpg-gray-700">
      {icon}
      <span className="text-tpg-gray-500">{label}:</span>
      <span className="capitalize text-tpg-ink">{value}</span>
    </span>
  );
}

function ProfileRow({
  label,
  value,
}: Readonly<{ label: string; value: string }>) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="text-xs uppercase tracking-wider text-tpg-gray-500">{label}</dt>
      <dd className="truncate text-right text-xs font-semibold capitalize text-tpg-ink">
        {value}
      </dd>
    </div>
  );
}

function Stat({
  value,
  label,
}: Readonly<{ value: string; label: string }>) {
  return (
    <div>
      <p className="text-xl font-bold text-tpg-ink">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-tpg-gray-500">{label}</p>
    </div>
  );
}
