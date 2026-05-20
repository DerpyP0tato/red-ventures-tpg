"use client";

import Link from "next/link";
import { Compass } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useProfile } from "@/lib/userStore";

export default function NotFound() {
  const profile = useProfile();
  const homeHref = profile ? "/dashboard" : "/";
  const homeLabel = profile ? "Back to your dashboard" : "Back to home";

  return (
    <>
      <Header />
      <main className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-white px-4 py-20">
        <div className="max-w-md border-t border-tpg-border bg-white p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-tpg-blue-soft text-tpg-blue">
            <Compass className="h-7 w-7" />
          </div>
          <p className="mt-5 text-xs font-bold uppercase tracking-widest text-tpg-blue">
            404
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-tpg-ink sm:text-3xl">
            We couldn&apos;t find that page.
          </h1>
          <p className="mt-3 text-sm text-tpg-gray-500">
            The article or section you were looking for may have moved — or
            it&apos;s not part of this prototype yet.
          </p>
          <Link
            href={homeHref}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-tpg-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-tpg-navy"
          >
            {homeLabel}
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
