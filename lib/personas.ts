// Demo personas — pre-built UserProfiles used to power one-click
// dashboard previews on the home page, the signup sign-in tab, and the
// admin diagnostics page. Adding a `savedSlugs` for each persona makes
// the Saved section on the dashboard feel "lived in".

import type { UserProfile } from "./types";

export interface DemoPersona {
  id: string;
  label: string;
  description: string;
  emoji: string;
  profile: UserProfile;
}

export const PERSONAS: DemoPersona[] = [
  {
    id: "beginner-japan",
    label: "Beginner planning Japan",
    description: "First-time points user with a Japan honeymoon in mind.",
    emoji: "🌸",
    profile: {
      name: "Alex Morgan",
      email: "alex@example.com",
      travelGoals: ["free-flights", "honeymoon", "premium-cabin"],
      dreamDestinations: ["japan", "hawaii"],
      homeAirport: "SFO",
      currentCards: [],
      spendCategories: ["dining", "travel-spend"],
      travelFrequency: "occasional",
      experience: "beginner",
      preferredBrands: ["hyatt", "united"],
      inferredIntent: "trip-planning",
      savedSlugs: ["japan-on-points", "points-miles-101"],
      createdAt: new Date().toISOString(),
    },
  },
  {
    id: "advanced-status",
    label: "Advanced status hunter",
    description: "A road warrior chasing lounge access and elite status.",
    emoji: "🛋️",
    profile: {
      name: "Priya Patel",
      email: "priya@example.com",
      travelGoals: ["earn-status", "premium-cabin", "luxury-hotels"],
      dreamDestinations: ["thailand", "europe"],
      homeAirport: "JFK",
      currentCards: ["tpg-platinum", "tpg-sapphire-preferred"],
      spendCategories: ["dining", "travel-spend"],
      travelFrequency: "road-warrior",
      experience: "advanced",
      preferredBrands: ["delta", "marriott"],
      inferredIntent: "maximizing",
      savedSlugs: ["premium-card-showdown", "lounge-access-guide"],
      createdAt: new Date().toISOString(),
    },
  },
  {
    id: "family-hawaii",
    label: "Family of four to Hawaii",
    description: "Intermediate user budgeting a family trip on points.",
    emoji: "🏝️",
    profile: {
      name: "Marcus Lee",
      email: "marcus@example.com",
      travelGoals: ["family-trip", "free-flights"],
      dreamDestinations: ["hawaii", "caribbean"],
      homeAirport: "ORD",
      currentCards: ["tpg-sapphire-preferred"],
      spendCategories: ["groceries", "dining", "gas"],
      travelFrequency: "occasional",
      experience: "intermediate",
      preferredBrands: ["hyatt"],
      inferredIntent: "trip-planning",
      savedSlugs: ["hawaii-on-miles", "family-travel-points"],
      createdAt: new Date().toISOString(),
    },
  },
];
