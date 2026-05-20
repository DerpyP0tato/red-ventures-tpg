"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import { Logo } from "./Logo";
import { clearProfile, useProfile } from "@/lib/userStore";

const NAV = [
  { label: "News", href: "/" },
  { label: "Credit Cards", href: "/" },
  { label: "Points & Miles", href: "/" },
  { label: "Reviews", href: "/" },
  { label: "Travel", href: "/" },
  { label: "Deals", href: "/" },
];

export function Header() {
  const profile = useProfile();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showJoinHint, setShowJoinHint] = useState(false);

  // Close menu on route change-ish (any click outside)
  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [menuOpen]);

  // Same for the mobile nav drop-down.
  useEffect(() => {
    if (!mobileNavOpen) return;
    const close = () => setMobileNavOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [mobileNavOpen]);

  // First-load hint pointing anonymous visitors at the Join CTA.
  // Auto-dismisses after 7s or on the first user click anywhere.
  useEffect(() => {
    if (profile) return;
    setShowJoinHint(true);
    const timer = setTimeout(() => setShowJoinHint(false), 7000);
    const dismiss = () => setShowJoinHint(false);
    window.addEventListener("click", dismiss, { once: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("click", dismiss);
    };
  }, [profile]);

  return (
    <header className="sticky top-0 z-40 border-b border-tpg-border bg-white shadow-[0_1px_0_rgba(0,0,0,0.04)]">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center gap-6 px-7 sm:px-7 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.label}
              href={n.href}
              className="rounded-md px-3 py-2 text-sm font-semibold text-tpg-gray-700 hover:bg-tpg-gray-50 hover:text-tpg-navy"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <button
            aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileNavOpen}
            onClick={(e) => {
              e.stopPropagation();
              setMobileNavOpen((v) => !v);
            }}
            className="rounded-full p-2 text-tpg-gray-700 hover:bg-tpg-gray-50 lg:hidden"
          >
            {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <button
            aria-label="Search — coming soon"
            title="Search — coming soon"
            disabled
            className="hidden cursor-not-allowed rounded-full p-2 text-tpg-gray-500 opacity-60 md:inline-flex"
          >
            <Search className="h-5 w-5" />
          </button>
          {profile ? (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen((v) => !v);
                }}
                className="flex items-center gap-2 rounded-full border border-tpg-gray-200 bg-white px-2 py-1 hover:border-tpg-blue"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-tpg-blue text-xs font-bold text-white">
                    {profile.name?.charAt(0).toUpperCase() ?? "U"}
                  </span>
                  <span className="hidden text-sm font-semibold text-tpg-navy sm:block">
                    {profile.name?.split(" ")[0]}
                  </span>
                  <ChevronDown className="h-4 w-4 text-tpg-gray-500" />
                </button>
                {menuOpen && (
                  // stopPropagation here keeps clicks inside the menu from
                  // bubbling to the window listener (which would re-close
                  // the menu before <Link> could trigger navigation).
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 top-12 w-56 rounded-xl border border-tpg-gray-200 bg-white p-2 shadow-lg"
                  >
                    <Link
                      href="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm font-semibold text-tpg-navy hover:bg-tpg-gray-50"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/newsletter"
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm text-tpg-gray-700 hover:bg-tpg-gray-50"
                    >
                      Newsletter preferences
                    </Link>
                    <Link
                      href="/onboarding"
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm text-tpg-gray-700 hover:bg-tpg-gray-50"
                    >
                      Edit preferences
                    </Link>
                    <button
                      onClick={() => {
                        clearProfile();
                        window.location.href = "/";
                      }}
                      className="block w-full rounded-lg px-3 py-2 text-left text-sm text-tpg-gray-700 hover:bg-tpg-gray-50"
                    >
                      Reset mock profile
                    </button>
                  </div>
                )}
            </div>
          ) : (
            <>
              <Link
                href="/signup"
                className="hidden text-sm font-semibold text-tpg-navy hover:text-tpg-blue sm:inline-block"
              >
                Sign in
              </Link>
              <div className="relative">
                <Link
                  href="/signup"
                  onClick={() => setShowJoinHint(false)}
                  className={`inline-flex rounded-full bg-tpg-blue px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-tpg-navy ${
                    showJoinHint ? "tpg-hint-pulse" : ""
                  }`}
                >
                  Join
                </Link>
                {showJoinHint && (
                  <div
                    role="tooltip"
                    className="tpg-hint-bounce absolute right-0 top-full z-50 mt-3 flex items-center gap-1.5 whitespace-nowrap rounded-md bg-tpg-ink px-3 py-1.5 text-xs font-semibold text-white shadow-lg"
                  >
                    <span
                      className="absolute -top-1 right-5 h-2 w-2 rotate-45 bg-tpg-ink"
                      aria-hidden
                    />
                    Start here — free
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      {mobileNavOpen && (
        <div className="border-t border-tpg-border bg-white lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-7 py-2 sm:px-7">
            {NAV.map((n) => (
              <Link
                key={n.label}
                href={n.href}
                onClick={() => setMobileNavOpen(false)}
                className="rounded-md px-3 py-3 text-sm font-semibold text-tpg-gray-700 hover:bg-tpg-gray-50 hover:text-tpg-navy"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
