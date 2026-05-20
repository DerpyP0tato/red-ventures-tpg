// --- M.A.D. Strategic Framework: Model Intent ---
// Simple, rule-based intent + recommendation engine that runs entirely
// in the browser. Each piece of content carries `tags`; the user profile
// carries the same tag vocabulary. We compute a score from tag overlap
// + a few weighted signals, and produce a human-readable "Recommended
// because..." string so the personalization is *visible* to the user.

import { ARTICLES, CARDS, DEALS, DESTINATIONS } from "./mockData";
import type {
  Article,
  CreditCard,
  Deal,
  Destination,
  Intent,
  Tag,
  UserProfile,
} from "./types";

export interface Scored<T> {
  item: T;
  score: number;
  reasons: string[]; // ordered list of why-strings
}

const INTENT_LABELS: Record<Intent, string> = {
  learning: "Learning about points & miles",
  "card-shopping": "Looking for a travel credit card",
  "trip-planning": "Planning an upcoming trip",
  "deal-hunting": "Searching for travel deals",
  "card-comparison": "Comparing credit cards",
  maximizing: "Maximizing rewards",
};

export function intentLabel(i: Intent) {
  return INTENT_LABELS[i];
}

/**
 * Infer the user's primary intent from onboarding answers.
 * Priority order is deliberate — trip planning beats card shopping when
 * a dream destination is set; learning wins for true beginners.
 */
export function inferIntent(p: Partial<UserProfile>): Intent {
  return inferIntentExplained(p).intent;
}

/**
 * Same logic as inferIntent, but also returns the rule that fired and the
 * signals that triggered it. The admin diagnostic page renders this so the
 * Model Intent layer of M.A.D. is fully transparent.
 */
export function inferIntentExplained(p: Partial<UserProfile>): {
  intent: Intent;
  rule: string;
  signals: string[];
} {
  const dreamCount = p.dreamDestinations?.length ?? 0;
  const hasDestination = dreamCount > 0;
  const isBeginner = p.experience === "beginner";
  const noCards = (p.currentCards?.length ?? 0) === 0;
  const wantsCabin = !!p.travelGoals?.includes("premium-cabin");
  const wantsStatus = !!p.travelGoals?.includes("earn-status");
  const heavyTraveler = p.travelFrequency === "frequent" || p.travelFrequency === "road-warrior";

  const signals: string[] = [
    `experience = ${p.experience ?? "—"}`,
    `dream destinations = ${dreamCount}`,
    `current cards = ${p.currentCards?.length ?? 0}`,
    `travel frequency = ${p.travelFrequency ?? "—"}`,
    `goals = ${p.travelGoals?.join(", ") || "—"}`,
  ];

  // A concrete trip goal beats every other signal — a beginner who's
  // already named Japan as a dream destination is trip-planning, not
  // still learning the basics.
  if (hasDestination && (wantsCabin || heavyTraveler))
    return {
      intent: "trip-planning",
      rule: "dream destination set AND (wants premium cabin OR is a frequent traveler) → user has a specific trip in mind",
      signals,
    };
  if (hasDestination)
    return {
      intent: "trip-planning",
      rule: "dream destination set → user is researching a future trip",
      signals,
    };
  if (isBeginner && noCards)
    return {
      intent: "learning",
      rule: "experience=beginner AND no current cards AND no dream destinations → user is still learning the basics",
      signals,
    };
  if (noCards)
    return {
      intent: "card-shopping",
      rule: "no current cards → user is shopping for their first travel card",
      signals,
    };
  if (wantsStatus || p.experience === "advanced")
    return {
      intent: "maximizing",
      rule: "wants elite status OR experience=advanced → user is optimizing an established stack",
      signals,
    };
  return {
    intent: "card-comparison",
    rule: "fallback — user has cards but no specific trip or status goal → comparing options",
    signals,
  };
}

// Tag → human label for explanation strings
const TAG_LABEL: Partial<Record<Tag, string>> = {
  japan: "Japan",
  europe: "Europe",
  italy: "Italy",
  iceland: "Iceland",
  thailand: "Thailand",
  hawaii: "Hawaii",
  caribbean: "the Caribbean",
  dining: "dining",
  groceries: "groceries",
  "travel-spend": "travel",
  gas: "gas",
  "premium-cabin": "premium cabin travel",
  "luxury-hotels": "luxury hotels",
  lounges: "lounge access",
  "transfer-partners": "transfer partners",
  "award-bookings": "award bookings",
  beginner: "you're new to points",
  intermediate: "you're building your strategy",
  advanced: "you're an advanced points traveler",
  united: "United",
  delta: "Delta",
  american: "American",
  hyatt: "Hyatt",
  marriott: "Marriott",
  amex: "Amex",
  chase: "Chase",
  "capital-one": "Capital One",
  "family-travel": "family travel",
};

function readableTag(t: Tag) {
  return TAG_LABEL[t] ?? t.replace(/-/g, " ");
}

// Build the set of tags that represent what the user cares about
export function userTagSet(p: UserProfile): Set<Tag> {
  const tags = new Set<Tag>();
  p.dreamDestinations?.forEach((t) => tags.add(t));
  p.spendCategories?.forEach((t) => tags.add(t));
  p.preferredBrands?.forEach((t) => tags.add(t));
  if (p.experience) tags.add(p.experience);
  if (p.travelGoals?.includes("premium-cabin")) tags.add("premium-cabin");
  if (p.travelGoals?.includes("luxury-hotels")) tags.add("luxury-hotels");
  if (p.travelGoals?.includes("earn-status")) tags.add("lounges");
  if (p.travelGoals?.includes("free-flights")) tags.add("award-bookings");
  if (p.travelGoals?.includes("family-trip")) tags.add("family-travel");
  return tags;
}

// Convert a matching tag into a reason string the user can read
function reasonFromTag(t: Tag, p: UserProfile): string | null {
  if (p.dreamDestinations.includes(t)) {
    return `You picked ${readableTag(t)} as a dream destination`;
  }
  if (p.spendCategories.includes(t)) {
    return `You spend heavily on ${readableTag(t)}`;
  }
  if (p.preferredBrands.includes(t)) {
    return `You prefer ${readableTag(t)}`;
  }
  if (t === p.experience) {
    return t === "beginner"
      ? "You're new to points and miles"
      : t === "advanced"
      ? "You're an advanced points traveler"
      : "You're building your points strategy";
  }
  if (t === "premium-cabin" && p.travelGoals.includes("premium-cabin")) {
    return "You want to fly business or first";
  }
  if (t === "luxury-hotels" && p.travelGoals.includes("luxury-hotels")) {
    return "You want to stay at luxury hotels";
  }
  if (t === "lounges" && p.travelGoals.includes("earn-status")) {
    return "You want to earn elite status";
  }
  if (t === "award-bookings" && p.travelGoals.includes("free-flights")) {
    return "You want free flights on points";
  }
  if (t === "family-travel" && p.travelGoals.includes("family-trip")) {
    return "You're planning a family trip";
  }
  return null;
}

function scoreItem<T extends { tags: Tag[]; intents?: Intent[] }>(
  item: T,
  p: UserProfile
): Scored<T> {
  let score = 0;
  const reasons: string[] = [];
  const userTags = userTagSet(p);

  for (const tag of item.tags) {
    if (userTags.has(tag)) {
      // Destination + spend matches are the strongest signals
      if (p.dreamDestinations.includes(tag)) score += 5;
      else if (p.spendCategories.includes(tag)) score += 4;
      else if (p.preferredBrands.includes(tag)) score += 3;
      else if (tag === p.experience) score += 2;
      else score += 2;
      const r = reasonFromTag(tag, p);
      if (r && !reasons.includes(r)) reasons.push(r);
    }
  }

  // Bonus for intent alignment on articles
  if (item.intents?.includes(p.inferredIntent)) {
    score += 3;
    reasons.unshift(`Your current intent is ${intentLabel(p.inferredIntent).toLowerCase()}`);
  }

  return { item, score, reasons };
}

function topN<T>(scored: Scored<T>[], n: number) {
  return scored.sort((a, b) => b.score - a.score).slice(0, n);
}

// Used when no scoring tag matched. Still better than a flat "Popular"
// because it acknowledges the user's intent/level — every recommendation
// stays visibly tied to *something* about the profile.
function fallbackReason(p: UserProfile, prefix: string) {
  return `${prefix} · matched to your ${intentLabel(p.inferredIntent).toLowerCase()}`;
}

export function recommendArticles(p: UserProfile, n = 4): Scored<Article>[] {
  const scored = ARTICLES.map((a) => scoreItem(a, p));
  // Always return something — if score is 0 we'll show editor picks
  const positive = scored.filter((s) => s.score > 0);
  if (positive.length >= n) return topN(positive, n);
  const fallback = ARTICLES.filter((a) => !positive.some((s) => s.item.slug === a.slug))
    .slice(0, n - positive.length)
    .map((a) => ({ item: a, score: 0, reasons: [fallbackReason(p, "Editor's pick")] }));
  return [...topN(positive, n), ...fallback].slice(0, n);
}

export function recommendCards(p: UserProfile, n = 3): Scored<CreditCard>[] {
  const scored = CARDS
    // Don't recommend a card the user already has
    .filter((c) => !p.currentCards.includes(c.id))
    .map((c) => {
      const s = scoreItem(c, p);
      // Audience match adds weight, otherwise advanced cards swamp beginners
      if (c.audience === p.experience) {
        s.score += 3;
      } else if (
        (c.audience === "advanced" && p.experience === "beginner") ||
        (c.audience === "beginner" && p.experience === "advanced")
      ) {
        s.score -= 4;
      }
      // Annual-fee aware: budget-minded users get a soft penalty on high AF
      if (p.travelGoals.includes("free-flights") && !p.travelGoals.includes("premium-cabin") && c.annualFee >= 500) {
        s.score -= 2;
      }
      return s;
    });
  return topN(scored, n);
}

export function recommendDeals(p: UserProfile, n = 3): Scored<Deal>[] {
  const scored = DEALS.map((d) => scoreItem(d, p));
  // Deals always show — fall back to first N if no matches
  const positive = scored.filter((s) => s.score > 0);
  if (positive.length === 0) {
    return scored.slice(0, n).map((s) => ({
      ...s,
      reasons: [fallbackReason(p, "Trending deal")],
    }));
  }
  return topN(positive, n);
}

export function recommendDestinations(p: UserProfile, n = 3): Scored<Destination>[] {
  const scored = DESTINATIONS.map((d) => scoreItem(d, p));
  const positive = scored.filter((s) => s.score > 0);
  if (positive.length >= n) return topN(positive, n);
  return [
    ...topN(positive, n),
    ...DESTINATIONS.filter((d) => !positive.some((s) => s.item.id === d.id))
      .slice(0, n - positive.length)
      .map((d) => ({ item: d, score: 0, reasons: [fallbackReason(p, "Editor's pick")] })),
  ].slice(0, n);
}

/**
 * Choose a "next best action" for the dashboard. The most useful suggestion
 * depends on the user's inferred intent.
 */
export function nextBestAction(p: UserProfile): {
  title: string;
  subtitle: string;
  cta: string;
  href: string;
} {
  switch (p.inferredIntent) {
    case "learning":
      return {
        title: "Start your 90-day beginner roadmap",
        subtitle: "A 6-minute read that maps out exactly what to do this month, next month, and after.",
        cta: "Open the roadmap",
        href: "/article/points-miles-101",
      };
    case "trip-planning": {
      const dest = p.dreamDestinations[0];
      if (dest === "japan")
        return {
          title: "Plan your Japan award flight",
          subtitle: "Three sweet-spot routings and the best transfer partners for each.",
          cta: "Open Japan guide",
          href: "/article/japan-on-points",
        };
      if (dest === "europe" || dest === "italy")
        return {
          title: "Lock in summer Europe award space",
          subtitle: "Award seats to Lisbon, Athens and Rome are opening up — here's how to grab them.",
          cta: "Open Europe guide",
          href: "/article/europe-summer-sweet-spots",
        };
      if (dest === "iceland")
        return {
          title: "Time your Iceland trip for the aurora",
          subtitle: "Where to fly into, which chain has the best aurora-zone properties, and when to book.",
          cta: "Open Iceland guide",
          href: "/article/iceland-northern-lights",
        };
      if (dest === "hawaii")
        return {
          title: "Find your Hawaii award flight",
          subtitle: "Which programs still get you to the islands for under 25k miles one-way.",
          cta: "Open Hawaii guide",
          href: "/article/hawaii-on-miles",
        };
      if (dest === "caribbean")
        return {
          title: "Maximize your Caribbean trip on points",
          subtitle: "Eight all-inclusive properties where points stretch the furthest — plus the best week to book.",
          cta: "Open Caribbean guide",
          href: "/article/all-inclusive-resorts",
        };
      return {
        title: "Plan your next trip on points",
        subtitle: "Browse destination-specific award guides matched to your goals.",
        cta: "Browse destinations",
        href: "/dashboard",
      };
    }
    case "card-shopping":
      return {
        title: "See your top 3 card matches",
        subtitle: "Personalized to your spend, travel frequency, and current cards.",
        cta: "Compare matches",
        href: "/dashboard",
      };
    case "card-comparison":
      return {
        title: "Premium card showdown",
        subtitle: "Three premium cards, one fee benchmark, one honest scorecard.",
        cta: "Read the comparison",
        href: "/article/premium-card-showdown",
      };
    case "deal-hunting":
      return {
        title: "This week's transfer bonus alerts",
        subtitle: "Three transfer promotions worth acting on this week.",
        cta: "View deals",
        href: "/article/transfer-bonus-watch",
      };
    case "maximizing":
      return {
        title: "Stack your dining multipliers",
        subtitle: "The smartest 3-card combo for dining-heavy spenders.",
        cta: "Open the playbook",
        href: "/article/dining-multipliers",
      };
  }
}

/**
 * Build a quick "learning path" — beginner vs advanced — so the dashboard
 * can offer a guided sequence of articles, not just a feed.
 */
export function learningPath(p: UserProfile) {
  if (p.experience === "beginner") {
    return {
      title: "Beginner path",
      steps: [
        ARTICLES.find((a) => a.slug === "points-miles-101")!,
        ARTICLES.find((a) => a.slug === "beginner-card-pairings")!,
        ARTICLES.find((a) => a.slug === "family-travel-points")!,
      ],
    };
  }
  if (p.experience === "advanced") {
    return {
      title: "Advanced path",
      steps: [
        ARTICLES.find((a) => a.slug === "premium-card-showdown")!,
        ARTICLES.find((a) => a.slug === "transfer-bonus-watch")!,
        ARTICLES.find((a) => a.slug === "lounge-access-guide")!,
      ],
    };
  }
  return {
    title: "Intermediate path",
    steps: [
      ARTICLES.find((a) => a.slug === "dining-multipliers")!,
      ARTICLES.find((a) => a.slug === "lounge-access-guide")!,
      ARTICLES.find((a) => a.slug === "japan-on-points")!,
    ],
  };
}
