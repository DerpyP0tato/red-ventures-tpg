// Shared types for mock data and user profile
// Kept in one file so it's easy to scan during a presentation.

export type Tag =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "trip-planning"
  | "deals"
  | "card-strategy"
  | "card-comparison"
  | "lounges"
  | "transfer-partners"
  | "award-bookings"
  | "japan"
  | "europe"
  | "hawaii"
  | "iceland"
  | "thailand"
  | "italy"
  | "caribbean"
  | "dining"
  | "groceries"
  | "travel-spend"
  | "gas"
  | "premium-cabin"
  | "luxury-hotels"
  | "family-travel"
  | "solo-travel"
  | "budget"
  | "amex"
  | "chase"
  | "capital-one"
  | "united"
  | "delta"
  | "american"
  | "hyatt"
  | "marriott";

export type Intent =
  | "learning"
  | "card-shopping"
  | "trip-planning"
  | "deal-hunting"
  | "card-comparison"
  | "maximizing";

export interface Article {
  slug: string;
  category: "Guide" | "News" | "Strategy" | "Review" | "Deal";
  title: string;
  excerpt: string;
  readTime: string;
  hero: string; // gradient class for placeholder
  tags: Tag[];
  intents: Intent[];
  body?: string[]; // paragraphs for detail page
}

export interface CreditCard {
  id: string;
  name: string;
  issuer: "Amex" | "Chase" | "Capital One" | "Citi";
  network: "Visa" | "Mastercard" | "Amex";
  annualFee: number;
  bonusPoints: number;
  bonusRequirement: string;
  highlights: string[];
  tags: Tag[];
  audience: "beginner" | "intermediate" | "advanced";
  color: string; // gradient for card chip
}

export interface Deal {
  id: string;
  title: string;
  partner: string;
  endsOn: string;
  perk: string;
  tags: Tag[];
}

export interface Destination {
  id: string;
  name: string;
  region: string;
  bestMonths: string;
  pointsTip: string;
  tags: Tag[];
  accent: string; // gradient class
}

export interface UserProfile {
  name: string;
  email: string;
  birthday?: string; // ISO date "YYYY-MM-DD", captured at signup
  // Onboarding answers
  travelGoals: string[]; // e.g. ["earn-status", "free-flights"]
  dreamDestinations: Tag[]; // e.g. ["japan", "europe"]
  dreamDestinationsOther?: string[]; // free-text destinations outside the tag vocabulary
  homeAirport: string;
  currentCards: string[]; // e.g. ["chase-sapphire-preferred"] or []
  spendCategories: Tag[]; // dining/groceries/etc
  travelFrequency: "rare" | "occasional" | "frequent" | "road-warrior";
  experience: "beginner" | "intermediate" | "advanced";
  preferredBrands: Tag[]; // airlines/hotels e.g. ["united","hyatt"]
  // Derived
  inferredIntent: Intent;
  savedSlugs: string[];
  createdAt: string;
}
