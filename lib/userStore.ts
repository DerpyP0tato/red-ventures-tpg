// localStorage-backed mock user store.
// Single key `tpg-mock-user`; dispatches a `tpgUserUpdated` event so the
// header and any subscribing components can re-render when the profile
// changes (sign in, onboarding complete, save toggle, reset).

"use client";

import type { UserProfile } from "./types";

const KEY = "tpg-mock-user";
const EVENT = "tpgUserUpdated";
const NL_KEY = "tpg-newsletter-sections";

export function loadProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

export function saveProfile(p: UserProfile) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(p));
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function clearProfile() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function toggleSaved(slug: string) {
  const p = loadProfile();
  if (!p) return;
  const saved = new Set(p.savedSlugs);
  if (saved.has(slug)) saved.delete(slug);
  else saved.add(slug);
  saveProfile({ ...p, savedSlugs: Array.from(saved) });
}

// ---- Newsletter section selections ----
// Stored as a JSON array of section IDs under NL_KEY. Treated as opt-in:
// if nothing is stored yet, callers fall back to `defaultSelectedSectionIds`.

export function loadNewsletterSections(): string[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(NL_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as string[];
  } catch {
    return null;
  }
}

export function saveNewsletterSections(ids: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(NL_KEY, JSON.stringify(ids));
  // No event dispatch — newsletter changes don't need to fan out to
  // useProfile subscribers, and doing so creates an infinite loop with
  // the newsletter page's auto-save effect.
}

export function subscribe(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

import { useEffect, useState } from "react";

/** React hook that returns the current mock profile and re-renders on change. */
export function useProfile(): UserProfile | null {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setProfile(loadProfile());
    setHydrated(true);
    const unsub = subscribe(() => setProfile(loadProfile()));
    return unsub;
  }, []);

  // Avoid SSR/CSR mismatch — until hydrated, behave as "no profile"
  return hydrated ? profile : null;
}
