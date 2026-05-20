// Newsletter SECTIONS for the customizable "Points Guy Briefing" newsletter.
// Unlike HBR (where each row is a separate newsletter subscription),
// every row here is a *section* the user can include or exclude from their
// single weekly newsletter — so picking sections shapes the contents of
// one delivered email.

import type { Intent, Tag } from "./types";

export interface NewsletterSection {
  id: string;
  group: "popular" | "for-you" | "beginner" | "advanced" | "special";
  frequency: "Daily" | "Weekly" | "Biweekly" | "Monthly" | "As needed";
  title: string;
  description: string;
  icon: string; // small emoji glyph; we render in a tinted square
  color: string; // tailwind gradient utility
  tags: Tag[];
  intents: Intent[];
  audience?: "beginner" | "intermediate" | "advanced" | "all";
  isEditorsPick?: boolean;
  isSpecialSeries?: boolean;
}

export const NEWSLETTER_SECTIONS: NewsletterSection[] = [
  // EDITOR'S PICK / FOR YOU
  {
    id: "for-you-brief",
    group: "for-you",
    frequency: "Weekly",
    title: "Your For You Brief",
    description:
      "A short editorial digest of the articles, cards, deals, and destinations our model surfaced just for you this week.",
    icon: "✨",
    color: "from-tpg-teal to-tpg-blue",
    tags: [],
    intents: ["learning", "trip-planning", "card-shopping", "deal-hunting", "card-comparison", "maximizing"],
    audience: "all",
    isEditorsPick: true,
  },

  // MOST POPULAR
  {
    id: "daily-sweet-spot",
    group: "popular",
    frequency: "Daily",
    title: "Today's Award Sweet Spot",
    description:
      "One sweet-spot award redemption a day — from sub-25k miles short hops to aspirational first class.",
    icon: "🎯",
    color: "from-amber-500 to-rose-500",
    tags: ["award-bookings", "transfer-partners"],
    intents: ["trip-planning", "maximizing", "deal-hunting"],
    audience: "all",
  },
  {
    id: "deal-radar",
    group: "popular",
    frequency: "Weekly",
    title: "Deal Radar",
    description:
      "Transfer bonuses, hotel promos, and limited-time card offers — ranked by relevance, not by clickbait.",
    icon: "📡",
    color: "from-emerald-500 to-tpg-teal",
    tags: ["deals", "transfer-partners"],
    intents: ["deal-hunting", "maximizing"],
    audience: "all",
  },
  {
    id: "card-spotlight",
    group: "popular",
    frequency: "Weekly",
    title: "Card Match Spotlight",
    description:
      "One credit card a week, scored against your spend, goals, and current wallet — with the why.",
    icon: "💳",
    color: "from-tpg-blue to-tpg-navy",
    tags: ["card-strategy", "card-comparison"],
    intents: ["card-shopping", "card-comparison", "maximizing"],
    audience: "all",
  },

  // BEGINNER
  {
    id: "beginners-corner",
    group: "beginner",
    frequency: "Weekly",
    title: "Beginner's Corner",
    description:
      "A bite-sized lesson each week from our 90-day beginner roadmap. No jargon, no pressure to spend.",
    icon: "🧭",
    color: "from-sky-500 to-tpg-blue",
    tags: ["beginner"],
    intents: ["learning"],
    audience: "beginner",
  },
  {
    id: "family-travel-hub",
    group: "beginner",
    frequency: "Monthly",
    title: "Family Travel Hub",
    description:
      "Strategies for booking a family of four on points — schools-out windows, multi-room hotel awards, and more.",
    icon: "👨‍👩‍👧",
    color: "from-pink-500 to-tpg-blue",
    tags: ["family-travel", "beginner"],
    intents: ["trip-planning", "learning"],
    audience: "beginner",
  },

  // ADVANCED
  {
    id: "power-user-playbook",
    group: "advanced",
    frequency: "Weekly",
    title: "Power User's Playbook",
    description:
      "Advanced tactics — manufactured spend, stopover hacks, fifth-night-free stacks. Read at your own risk.",
    icon: "♟️",
    color: "from-tpg-navy-deep to-tpg-teal-deep",
    tags: ["advanced", "transfer-partners"],
    intents: ["maximizing"],
    audience: "advanced",
  },
  {
    id: "lounge-watch",
    group: "advanced",
    frequency: "Biweekly",
    title: "Lounge & Status Watch",
    description:
      "New lounges, status match opportunities, and changes to elite benefits — across every program we track.",
    icon: "🛋️",
    color: "from-tpg-navy to-tpg-teal",
    tags: ["lounges", "premium-cabin", "advanced"],
    intents: ["card-comparison", "maximizing"],
    audience: "advanced",
  },
  {
    id: "premium-cabin-radar",
    group: "advanced",
    frequency: "Weekly",
    title: "Premium Cabin Radar",
    description:
      "When and where award space opens up for business and first — with the exact program and partner to use.",
    icon: "🛫",
    color: "from-rose-500 to-tpg-blue",
    tags: ["premium-cabin", "award-bookings"],
    intents: ["trip-planning", "maximizing"],
    audience: "intermediate",
  },

  // SPECIAL SERIES (limited run)
  {
    id: "japan-cherry-blossom",
    group: "special",
    frequency: "Weekly",
    title: "Japan Cherry-Blossom Countdown",
    description:
      "An eight-week series on flying business class to Japan in time for sakura — routings, hotels, and timing.",
    icon: "🌸",
    color: "from-rose-400 to-rose-600",
    tags: ["japan", "premium-cabin", "award-bookings"],
    intents: ["trip-planning"],
    isSpecialSeries: true,
  },
  {
    id: "europe-summer-series",
    group: "special",
    frequency: "Weekly",
    title: "Europe Summer Sweet Spots",
    description:
      "A six-week series tracking summer Europe award space across every major alliance — week by week.",
    icon: "🏛️",
    color: "from-sky-500 to-amber-400",
    tags: ["europe", "italy", "award-bookings"],
    intents: ["trip-planning", "deal-hunting"],
    isSpecialSeries: true,
  },
  {
    id: "iceland-aurora-series",
    group: "special",
    frequency: "Weekly",
    title: "Iceland Aurora Series",
    description:
      "A five-week special on chasing the northern lights on points — when to book, where to stay, what to fly.",
    icon: "🌌",
    color: "from-indigo-500 to-tpg-teal",
    tags: ["iceland", "trip-planning"],
    intents: ["trip-planning"],
    isSpecialSeries: true,
  },

  // MORE POPULAR
  {
    id: "transfer-bonus-alerts",
    group: "popular",
    frequency: "As needed",
    title: "Transfer Bonus Alerts",
    description:
      "We ping you the moment a 20%+ transfer bonus drops at Amex, Chase, Capital One, or Citi.",
    icon: "📈",
    color: "from-tpg-teal-deep to-tpg-blue",
    tags: ["transfer-partners", "deals", "advanced"],
    intents: ["maximizing", "deal-hunting"],
    audience: "all",
  },
  {
    id: "weekly-card-news",
    group: "popular",
    frequency: "Weekly",
    title: "Weekly Card News",
    description:
      "New welcome bonuses, application rule changes, and quietly updated benefits — every Tuesday.",
    icon: "📰",
    color: "from-tpg-navy to-tpg-blue",
    tags: ["card-strategy", "card-comparison"],
    intents: ["card-shopping", "card-comparison"],
    audience: "all",
  },
  {
    id: "hotel-promo-tracker",
    group: "popular",
    frequency: "Biweekly",
    title: "Hotel Promo Tracker",
    description:
      "Hyatt, Marriott, IHG, and Hilton promotions worth registering for — and the ones that aren't.",
    icon: "🏨",
    color: "from-amber-500 to-tpg-teal",
    tags: ["luxury-hotels", "hyatt", "marriott", "deals"],
    intents: ["deal-hunting", "trip-planning"],
    audience: "all",
  },

  // MORE BEGINNER
  {
    id: "first-card-coach",
    group: "beginner",
    frequency: "Weekly",
    title: "First Card Coach",
    description:
      "A guided 90-day plan to your first welcome bonus — one short email a week, no overspending.",
    icon: "🎓",
    color: "from-sky-500 to-tpg-teal",
    tags: ["beginner", "card-strategy"],
    intents: ["learning", "card-shopping"],
    audience: "beginner",
  },
  {
    id: "budget-traveler-digest",
    group: "beginner",
    frequency: "Monthly",
    title: "Budget Traveler Digest",
    description:
      "Trip ideas for under $500 cash + a small stash of points — including itineraries you can copy.",
    icon: "💰",
    color: "from-emerald-500 to-tpg-blue",
    tags: ["budget", "beginner", "trip-planning"],
    intents: ["trip-planning", "learning"],
    audience: "beginner",
  },

  // MORE ADVANCED
  {
    id: "devaluation-watch",
    group: "advanced",
    frequency: "As needed",
    title: "Devaluation Watch",
    description:
      "Programs we expect to change — and a heads-up window to book before they do.",
    icon: "⚠️",
    color: "from-tpg-navy-deep to-rose-500",
    tags: ["advanced", "award-bookings"],
    intents: ["maximizing"],
    audience: "advanced",
  },
  {
    id: "stopover-strategist",
    group: "advanced",
    frequency: "Biweekly",
    title: "Stopover Strategist",
    description:
      "Open-jaw and stopover routings that turn one award into two cities — across eight major programs.",
    icon: "🗺️",
    color: "from-tpg-teal to-tpg-blue",
    tags: ["advanced", "award-bookings", "trip-planning"],
    intents: ["maximizing", "trip-planning"],
    audience: "advanced",
  },
  {
    id: "manufactured-spend-monitor",
    group: "advanced",
    frequency: "Monthly",
    title: "Manufactured Spend Monitor",
    description:
      "What still works in 2026, what got shut down, and the methods we don't recommend — clearly labeled.",
    icon: "🧪",
    color: "from-fuchsia-500 to-tpg-navy",
    tags: ["advanced", "card-strategy"],
    intents: ["maximizing"],
    audience: "advanced",
  },

  // MORE FOR-YOU / GENERAL
  {
    id: "dining-rewards-roundup",
    group: "for-you",
    frequency: "Weekly",
    title: "Dining Rewards Roundup",
    description:
      "Best restaurant promos, dining-credit stacks, and the cards earning the most at the table.",
    icon: "🍽️",
    color: "from-rose-500 to-amber-400",
    tags: ["dining", "card-strategy"],
    intents: ["maximizing", "card-comparison"],
    audience: "all",
  },
  {
    id: "grocery-multiplier-watch",
    group: "for-you",
    frequency: "Monthly",
    title: "Grocery Multiplier Watch",
    description:
      "Quarterly rotating categories, supermarket promos, and the highest-earning grocery cards by zip code.",
    icon: "🛒",
    color: "from-emerald-500 to-tpg-teal-deep",
    tags: ["groceries", "card-strategy"],
    intents: ["maximizing"],
    audience: "all",
  },
  {
    id: "solo-traveler-edit",
    group: "for-you",
    frequency: "Monthly",
    title: "Solo Traveler Edit",
    description:
      "Trips, programs, and cards that don't penalize solo travelers — handpicked monthly.",
    icon: "🎒",
    color: "from-fuchsia-500 to-tpg-blue",
    tags: ["solo-travel", "trip-planning"],
    intents: ["trip-planning"],
    audience: "all",
  },
  {
    id: "luxury-hotel-watch",
    group: "for-you",
    frequency: "Biweekly",
    title: "Luxury Hotel Watch",
    description:
      "Editor-tested luxury stays bookable on points — Park Hyatts, Ritz Cartons, and the boutique outliers.",
    icon: "🏝️",
    color: "from-amber-500 to-rose-500",
    tags: ["luxury-hotels", "hyatt", "marriott"],
    intents: ["trip-planning", "maximizing"],
    audience: "intermediate",
  },

  // MORE SPECIAL SERIES
  {
    id: "thailand-island-hop",
    group: "special",
    frequency: "Weekly",
    title: "Thailand Island-Hop",
    description:
      "A six-week series chaining Thailand's best Hyatt and IHG properties into one points-funded itinerary.",
    icon: "🌴",
    color: "from-emerald-500 to-tpg-teal",
    tags: ["thailand", "hyatt", "luxury-hotels"],
    intents: ["trip-planning"],
    isSpecialSeries: true,
  },
  {
    id: "hawaii-family-series",
    group: "special",
    frequency: "Weekly",
    title: "Hawaii Family Playbook",
    description:
      "A four-week series for booking a family-of-four trip to Hawaii on points — inter-island flights included.",
    icon: "🏝️",
    color: "from-cyan-500 to-tpg-blue",
    tags: ["hawaii", "family-travel", "award-bookings"],
    intents: ["trip-planning"],
    isSpecialSeries: true,
  },
  {
    id: "caribbean-allinclusive",
    group: "special",
    frequency: "Weekly",
    title: "Caribbean All-Inclusive Index",
    description:
      "Ranking every points-bookable all-inclusive in the Caribbean by cents-per-point and guest reviews.",
    icon: "🐚",
    color: "from-tpg-teal-deep to-amber-400",
    tags: ["caribbean", "luxury-hotels", "marriott", "hyatt"],
    intents: ["trip-planning", "deal-hunting"],
    isSpecialSeries: true,
  },
  {
    id: "italy-vintage-series",
    group: "special",
    frequency: "Weekly",
    title: "Italy Slow-Travel Series",
    description:
      "A seven-week dive into Italy beyond Rome — Tuscany, Puglia, and the Amalfi Coast on points.",
    icon: "🇮🇹",
    color: "from-emerald-500 to-amber-400",
    tags: ["italy", "europe", "luxury-hotels"],
    intents: ["trip-planning"],
    isSpecialSeries: true,
  },
  {
    id: "amex-transfer-deep-dive",
    group: "special",
    frequency: "Weekly",
    title: "Amex Transfer Deep-Dive",
    description:
      "A five-week tour of every Amex Membership Rewards transfer partner — with the best sweet spot at each.",
    icon: "💠",
    color: "from-tpg-navy to-tpg-teal-deep",
    tags: ["amex", "transfer-partners", "advanced"],
    intents: ["maximizing"],
    isSpecialSeries: true,
  },
];

export interface ScoredSection {
  section: NewsletterSection;
  score: number;
  reasons: string[];
  recommended: boolean; // true if we'd pre-select this for the user
}

/**
 * Score a newsletter section against a user profile.
 *
 * Scoring rules (mirror the personalization engine, but on sections):
 * - Tag overlap with destinations / spend / brands / experience: +1..+5
 * - Intent alignment: +3
 * - Audience match (beginner section for beginner user): +2; mismatch: -3
 * - Editor's Pick: +1 for everyone
 */
export function scoreSection(
  section: NewsletterSection,
  profile: Pick<
    import("./types").UserProfile,
    | "dreamDestinations"
    | "spendCategories"
    | "preferredBrands"
    | "experience"
    | "travelGoals"
    | "inferredIntent"
  >
): ScoredSection {
  const reasons: string[] = [];
  let score = 0;

  // Intent alignment is the strongest signal
  if (section.intents.includes(profile.inferredIntent)) {
    score += 3;
    reasons.push(`matches your inferred intent`);
  }

  // Audience match
  if (section.audience && section.audience !== "all") {
    if (section.audience === profile.experience) {
      score += 2;
      reasons.push(`tuned for ${profile.experience} readers`);
    } else if (
      (section.audience === "advanced" && profile.experience === "beginner") ||
      (section.audience === "beginner" && profile.experience === "advanced")
    ) {
      score -= 3;
    }
  }

  // Tag overlaps
  for (const t of section.tags) {
    if (profile.dreamDestinations.includes(t)) {
      score += 5;
      reasons.push(`you chose ${labelFor(t)} as a dream destination`);
    } else if (profile.spendCategories.includes(t)) {
      score += 3;
      reasons.push(`you spend on ${labelFor(t)}`);
    } else if (profile.preferredBrands.includes(t)) {
      score += 3;
      reasons.push(`you prefer ${labelFor(t)}`);
    } else if (t === profile.experience) {
      score += 2;
    } else if (
      t === "premium-cabin" &&
      profile.travelGoals.includes("premium-cabin")
    ) {
      score += 2;
      reasons.push(`you want to fly business or first`);
    } else if (
      t === "award-bookings" &&
      profile.travelGoals.includes("free-flights")
    ) {
      score += 2;
      reasons.push(`you want free flights on points`);
    }
  }

  if (section.isEditorsPick) score += 1;

  // Pre-select if it's a strong match. Editor's Pick is always pre-selected.
  const recommended = section.isEditorsPick || score >= 3;
  return { section, score, reasons: dedupe(reasons), recommended };
}

function dedupe(arr: string[]) {
  return Array.from(new Set(arr));
}

function labelFor(t: Tag) {
  return t.replace(/-/g, " ");
}

export function scoreAllSections(
  profile: Pick<
    import("./types").UserProfile,
    | "dreamDestinations"
    | "spendCategories"
    | "preferredBrands"
    | "experience"
    | "travelGoals"
    | "inferredIntent"
  >
) {
  return NEWSLETTER_SECTIONS.map((s) => scoreSection(s, profile));
}

/** Default selected section IDs for a fresh profile (recommended ones). */
export function defaultSelectedSectionIds(
  profile: Parameters<typeof scoreAllSections>[0]
) {
  return scoreAllSections(profile)
    .filter((s) => s.recommended)
    .map((s) => s.section.id);
}
