"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Minus,
  Award,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArticleCard } from "@/components/ArticleCard";
import { CardModule } from "@/components/CardModule";
import { ARTICLES, CARDS } from "@/lib/mockData";
import { saveProfile, useProfile } from "@/lib/userStore";
import { PERSONAS } from "@/lib/personas";
import {
  recommendArticles,
  recommendCards,
} from "@/lib/personalization";
import type { Article, CreditCard } from "@/lib/types";

const CATEGORIES = [
  "For you",
  "Beginners",
  "Award Travel",
  "Credit Cards",
  "Deals",
  "Reviews",
];

const VALUATIONS = [
  { program: "Chase Ultimate Rewards", value: "2.05¢", trend: "up" as const },
  { program: "Amex Membership Rewards", value: "2.00¢", trend: "flat" as const },
  { program: "Capital One Miles", value: "1.85¢", trend: "up" as const },
  { program: "World of Hyatt", value: "1.70¢", trend: "up" as const },
  { program: "United MileagePlus", value: "1.35¢", trend: "down" as const },
  { program: "Marriott Bonvoy", value: "0.70¢", trend: "flat" as const },
];

const TOPIC_GROUPS: { title: string; tagMatch: (a: Article) => boolean }[] = [
  {
    title: "Credit Cards",
    tagMatch: (a) =>
      a.tags.some((t) =>
        ["card-strategy", "card-comparison"].includes(t),
      ),
  },
  {
    title: "Aviation",
    tagMatch: (a) =>
      a.tags.some((t) =>
        ["premium-cabin", "lounges", "award-bookings"].includes(t),
      ),
  },
  {
    title: "Hotels",
    tagMatch: (a) =>
      a.tags.some((t) =>
        ["luxury-hotels", "hyatt", "marriott"].includes(t),
      ),
  },
  {
    title: "Destinations",
    tagMatch: (a) =>
      a.tags.some((t) =>
        ["japan", "europe", "italy", "iceland", "hawaii", "caribbean"].includes(
          t,
        ),
      ),
  },
];

export default function HomePage() {
  const profile = useProfile();
  const router = useRouter();
  const [tab, setTab] = useState("For you");

  function tryPersona(p: (typeof PERSONAS)[number]) {
    saveProfile(p.profile);
    router.push("/dashboard");
  }

  const showRedirect = !!profile;

  // Hero card: top recommendation if logged in, otherwise the flagship
  const heroCard: CreditCard = profile
    ? recommendCards(profile, 1)[0]?.item ?? CARDS[3]
    : CARDS[3];

  // Article grid: personalized list (with reasons) or static fallback.
  // Pull the full pool so the tab filter has enough to work with.
  const scoredArticles = profile
    ? recommendArticles(profile, ARTICLES.length)
    : null;
  const editorialArticles = scoredArticles
    ? scoredArticles.map((s) => ({ article: s.item, reasons: s.reasons }))
    : ARTICLES.map((a) => ({
        article: a,
        reasons: undefined as string[] | undefined,
      }));

  const filteredArticles = useMemo(
    () =>
      editorialArticles
        .filter(({ article }) => matchesTab(article, tab))
        .slice(0, 12),
    [editorialArticles, tab],
  );

  // Pair the advertiser hero card with a related editorial article so
  // "Learn more" routes to something concrete instead of leading nowhere.
  const heroArticle = useMemo(() => {
    const match = ARTICLES.find((a) =>
      a.tags.some((t) => heroCard.tags.includes(t)),
    );
    return match ?? ARTICLES[0];
  }, [heroCard]);

  // Partner offers
  const scoredCards = profile ? recommendCards(profile, 4) : null;
  const partnerOffers = scoredCards
    ? scoredCards.map((s) => ({ card: s.item, reasons: s.reasons }))
    : CARDS.slice(0, 4).map((c) => ({ card: c, reasons: undefined }));

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Welcome-back ribbon */}
        {showRedirect && profile && (
          <div className="border-b border-tpg-border bg-tpg-blue-soft">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-7 py-2 text-xs sm:px-7 lg:px-8">
              <p className="text-tpg-navy">
                <span className="font-semibold">
                  Welcome back, {profile.name?.split(" ")[0]}.
                </span>{" "}
                Your personalized feed is ready.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1 font-semibold text-tpg-blue hover:underline"
              >
                Open dashboard <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* ADVERTISER HERO */}
        <section className="border-b border-tpg-border bg-white">
          <div className="mx-auto max-w-7xl px-7 py-8 sm:px-7 md:py-12 lg:px-8">
            <p className="text-[10px] font-bold uppercase tracking-widest text-tpg-gray-500">
              Advertisement
            </p>
            <div className="mt-3 grid items-center gap-8 sm:grid-cols-[1fr_auto]">
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-tpg-blue">
                  {heroCard.issuer} · {heroCard.name}
                </p>
                <h1 className="mt-2 text-2xl font-bold tracking-tight text-tpg-ink sm:text-3xl md:text-5xl">
                  Earn {heroCard.bonusPoints.toLocaleString()} bonus points
                </h1>
                <p className="mt-3 max-w-xl text-base text-tpg-gray-700">
                  After you {heroCard.bonusRequirement.toLowerCase()}. Plus, get
                  perks designed for the way you actually travel.
                </p>
                <ul className="mt-5 space-y-2 text-sm text-tpg-gray-700">
                  {heroCard.highlights.slice(0, 3).map((h) => (
                    <li key={h} className="flex items-center gap-2">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-tpg-blue" />
                      {h}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <Link
                    href={`/article/${heroArticle.slug}`}
                    className="rounded-full bg-tpg-red px-6 py-2.5 text-sm font-bold text-white hover:bg-red-700"
                  >
                    Learn more
                  </Link>
                  <p className="text-xs font-semibold text-tpg-red">
                    Offer expires Dec 31, 2026
                  </p>
                </div>
              </div>
              <div className="relative">
                <div
                  className={`relative aspect-[5/3] w-full max-w-[20rem] overflow-hidden rounded-xl bg-gradient-to-br ${heroCard.color} p-5 text-white shadow-xl ring-1 ring-black/10 sm:aspect-auto sm:h-48 sm:w-80`}
                >
                  <div className="text-[10px] font-bold uppercase tracking-widest opacity-80">
                    {heroCard.issuer}
                  </div>
                  <div className="mt-4 text-base font-bold leading-tight">
                    {heroCard.name}
                  </div>
                  <div className="absolute right-5 top-12 h-8 w-12 rounded-md bg-amber-300/80" />
                  <div className="absolute bottom-5 left-5 text-[10px] font-bold uppercase tracking-widest opacity-80">
                    {heroCard.network}
                  </div>
                  <div className="absolute bottom-5 right-5 flex gap-0.5">
                    <span className="h-4 w-0.5 rounded-full bg-white/60" />
                    <span className="h-4 w-0.5 rounded-full bg-white/40" />
                    <span className="h-4 w-0.5 rounded-full bg-white/20" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* YOUR LIFE REWARDED — editorial grid */}
        <section className="mx-auto max-w-7xl px-7 py-12 sm:px-7 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-tpg-border pb-4">
            <h2 className="text-3xl font-bold tracking-tight text-tpg-ink">
              {profile ? "For You" : "Your Life Rewarded"}
            </h2>
            <div className="relative -mx-7 sm:mx-0">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide px-7 sm:gap-1 sm:px-0">
                {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setTab(c)}
                  className={`shrink-0 px-4 py-2.5 text-sm font-semibold transition sm:px-3 sm:py-2 ${
                    tab === c
                      ? "border-b-2 border-tpg-blue text-tpg-ink"
                      : "text-tpg-gray-500 hover:text-tpg-blue"
                  }`}
                >
                  {c}
                </button>
              ))}
              </div>
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent sm:hidden"
              />
            </div>
          </div>
          {filteredArticles.length > 0 ? (
            <div className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {filteredArticles.map(({ article, reasons }) => (
                <ArticleCard
                  key={article.slug}
                  article={article}
                  reasons={reasons}
                />
              ))}
            </div>
          ) : (
            <p className="mt-10 text-sm text-tpg-gray-500">
              No articles in this category yet — check back soon.
            </p>
          )}
        </section>

        {/* GREAT OFFERS FROM PARTNERS */}
        <section className="bg-bg-cream">
          <div className="mx-auto max-w-7xl px-7 py-12 sm:px-7 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-tpg-border pb-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-tpg-ink">
                  Great Offers from Partners
                </h2>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-tpg-gray-500">
                  Advertiser Disclosure
                </p>
              </div>
              <Link
                href="/signup"
                className="text-sm font-semibold text-tpg-blue hover:underline"
              >
                See all offers →
              </Link>
            </div>
            <div className="mt-2 grid gap-0 lg:grid-cols-2">
              {partnerOffers.map(({ card, reasons }) => (
                <CardModule
                  key={card.id}
                  card={card}
                  reasons={reasons}
                  matchLabel={profile ? "Great match" : "Popular"}
                  layout="slab"
                />
              ))}
            </div>
          </div>
        </section>

        {/* WHAT ARE YOUR POINTS WORTH */}
        <section className="mx-auto max-w-7xl px-7 py-12 sm:px-7 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-tpg-border pb-4">
            <h2 className="text-3xl font-bold tracking-tight text-tpg-ink">
              What Are Your Points Worth?
            </h2>
            <Link
              href="/"
              className="text-sm font-semibold text-tpg-blue hover:underline"
            >
              See all 30+ valuations →
            </Link>
          </div>
          <dl className="mt-6 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
            {VALUATIONS.map((v) => (
              <div
                key={v.program}
                className="flex items-center justify-between border-t border-tpg-border py-4"
              >
                <dt className="text-sm font-semibold text-tpg-ink">
                  {v.program}
                </dt>
                <dd className="flex items-center gap-2">
                  <span className="text-xl font-bold tabular-nums text-tpg-ink">
                    {v.value}
                  </span>
                  <TrendIcon trend={v.trend} />
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* NAVIGATE WITH MORE NEWS */}
        <section className="border-t border-tpg-border bg-white">
          <div className="mx-auto max-w-7xl px-7 py-12 sm:px-7 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-tpg-ink">
              Navigate with More News, Reviews + Guides
            </h2>
            <div className="mt-8 grid gap-x-10 gap-y-10 md:grid-cols-2">
              {TOPIC_GROUPS.map((group) => {
                const items = ARTICLES.filter(group.tagMatch).slice(0, 4);
                return (
                  <div key={group.title}>
                    <div className="flex items-center justify-between border-b border-tpg-border pb-2">
                      <h3 className="text-lg font-bold tracking-tight text-tpg-ink">
                        {group.title}
                      </h3>
                      <Link
                        href="/"
                        className="text-xs font-semibold text-tpg-blue hover:underline"
                      >
                        More <ArrowUpRight className="inline h-3 w-3" />
                      </Link>
                    </div>
                    <ul className="mt-4 space-y-4">
                      {items.map((a) => (
                        <li
                          key={a.slug}
                          className="border-b border-tpg-border pb-4 last:border-0"
                        >
                          <Link
                            href={`/article/${a.slug}`}
                            className="group flex items-start gap-4"
                          >
                            <div
                              className={`relative aspect-[5/4] h-20 w-20 shrink-0 overflow-hidden bg-gradient-to-br ${a.hero}`}
                            />
                            <div className="min-w-0">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-tpg-blue">
                                {a.category}
                              </p>
                              <h4 className="mt-1 text-sm font-bold leading-snug text-tpg-ink group-hover:text-tpg-blue">
                                {a.title}
                              </h4>
                              <p className="mt-1 text-xs text-tpg-gray-500">
                                {a.readTime}
                              </p>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* POINTS 101 + CARDMATCH */}
        <section className="bg-tpg-navy text-white">
          <div className="mx-auto grid max-w-7xl gap-6 px-7 py-12 sm:px-7 md:grid-cols-2 lg:px-8">
            <div className="flex flex-col justify-between gap-6 border border-white/10 p-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-white/70">
                  Points 101
                </p>
                <h3 className="mt-2 text-2xl font-bold tracking-tight">
                  New to points & miles? Start here.
                </h3>
                <p className="mt-3 text-sm text-white/80">
                  A no-jargon roadmap for turning everyday spending into your
                  first free flight.
                </p>
              </div>
              <Link
                href="/article/points-miles-101"
                className="inline-flex w-fit items-center gap-2 rounded-full bg-tpg-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-white hover:text-tpg-navy"
              >
                Explore the basics <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="flex flex-col justify-between gap-6 border border-white/10 p-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-white/70">
                  CardMatch™
                </p>
                <h3 className="mt-2 text-2xl font-bold tracking-tight">
                  Find your next card in 60 seconds.
                </h3>
                <p className="mt-3 text-sm text-white/80">
                  Tell us your goals and spend habits. We&apos;ll surface the
                  cards that actually fit — and tell you why.
                </p>
              </div>
              <Link
                href={profile ? "/dashboard" : "/signup"}
                className="inline-flex w-fit items-center gap-2 rounded-full bg-tpg-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-white hover:text-tpg-navy"
              >
                {profile ? "View your matches" : "Take the quiz"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* PERSONALIZATION TEASER (anonymous only) */}
        {!profile && (
          <section className="border-y border-tpg-border bg-bg-cream">
            <div className="mx-auto max-w-7xl px-7 py-14 sm:px-7 lg:px-8">
              <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2">
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-tpg-blue-soft px-3 py-1 text-xs font-semibold text-tpg-blue">
                    <Sparkles className="h-3.5 w-3.5" /> M.A.D. Framework
                  </span>
                  <h2 className="mt-3 text-3xl font-bold tracking-tight text-tpg-ink md:text-4xl">
                    Build your wallet around the trips you actually want to
                    take.
                  </h2>
                  <p className="mt-3 max-w-xl text-tpg-gray-700">
                    Tell us your goals, dream destinations, and spend habits.
                    We&apos;ll tailor your home feed, surface the card matches
                    that actually fit, and tell you exactly why — every time.
                  </p>
                  <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    <Pillar
                      icon={<Sparkles className="h-4 w-4" />}
                      title="Model your intent"
                      body="A simple model infers whether you're learning, planning, or maximizing."
                    />
                    <Pillar
                      icon={<Award className="h-4 w-4" />}
                      title="Account that knows you"
                      body="Privacy-conscious onboarding turns one-time visits into a profile that earns for you."
                    />
                    <Pillar
                      icon={<TrendingUp className="h-4 w-4" />}
                      title="Dashboard for you"
                      body="A live For You page of articles, cards, deals, and destinations matched to your goals."
                    />
                  </div>
                </div>
                <div className="flex flex-col justify-between gap-6 border border-tpg-border bg-white p-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-tpg-blue">
                      Free · 60 seconds
                    </p>
                    <h3 className="mt-2 text-2xl font-bold tracking-tight text-tpg-ink">
                      Unlock your personalized feed.
                    </h3>
                    <ul className="mt-4 space-y-2 text-sm text-tpg-gray-700">
                      <li>· Tailored article recommendations</li>
                      <li>· Card matches scored to your spend</li>
                      <li>· Deal alerts for your destinations</li>
                      <li>· A clear next-best-action every week</li>
                    </ul>
                  </div>
                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-tpg-blue px-4 py-3 text-sm font-semibold text-white hover:bg-tpg-navy"
                  >
                    Create your free account <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
              <div className="mt-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-tpg-gray-500">
                  Or jump straight into a sample profile
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {PERSONAS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => tryPersona(p)}
                      className="inline-flex items-center gap-2 rounded-md border border-tpg-border bg-white px-3 py-1.5 text-xs font-semibold text-tpg-ink transition hover:border-tpg-blue hover:text-tpg-blue"
                    >
                      <span>{p.emoji}</span>
                      {p.label}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-[11px] text-tpg-gray-500">
                  One click — drops you into a fully personalized dashboard.
                </p>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}

function matchesTab(article: Article, tab: string): boolean {
  if (tab === "For you") return true;
  if (tab === "Beginners") return article.tags.includes("beginner");
  if (tab === "Award Travel")
    return (
      article.tags.includes("award-bookings") ||
      article.tags.includes("premium-cabin") ||
      article.tags.includes("transfer-partners")
    );
  if (tab === "Credit Cards")
    return (
      article.tags.includes("card-strategy") ||
      article.tags.includes("card-comparison")
    );
  if (tab === "Deals")
    return article.category === "Deal" || article.tags.includes("deals");
  if (tab === "Reviews") return article.category === "Review";
  return true;
}

function TrendIcon({ trend }: Readonly<{ trend: "up" | "down" | "flat" }>) {
  if (trend === "up")
    return <TrendingUp className="h-4 w-4 text-emerald-700" />;
  if (trend === "down")
    return <TrendingDown className="h-4 w-4 text-tpg-red" />;
  return <Minus className="h-4 w-4 text-tpg-gray-500" />;
}

function Pillar({
  icon,
  title,
  body,
}: Readonly<{
  icon: React.ReactNode;
  title: string;
  body: string;
}>) {
  return (
    <div className="border border-tpg-border bg-white p-4">
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-tpg-blue text-white">
        {icon}
      </div>
      <p className="mt-3 text-sm font-semibold text-tpg-ink">{title}</p>
      <p className="mt-1 text-xs text-tpg-gray-500">{body}</p>
    </div>
  );
}

