"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Bookmark,
  BookmarkCheck,
  Globe,
  Link as LinkIcon,
  Mail,
  MessageCircle,
  Share2,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArticleCard } from "@/components/ArticleCard";
import { CardModule } from "@/components/CardModule";
import { RecommendationBadge } from "@/components/RecommendationBadge";
import { ARTICLES, CARDS } from "@/lib/mockData";
import { toggleSaved, useProfile } from "@/lib/userStore";
import { recommendArticles, recommendCards } from "@/lib/personalization";

const AUTHOR = {
  name: "Brian Kelly",
  title: "Senior Points Strategist",
};

export default function ArticleDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const article = ARTICLES.find((a) => a.slug === slug);

  const profile = useProfile();
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  function copyLink() {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
  }

  useEffect(() => {
    if (profile && slug) setSaved(profile.savedSlugs.includes(slug));
  }, [profile, slug]);

  const personalReasons = useMemo(() => {
    if (!profile || !article) return [];
    const found = recommendArticles(profile, ARTICLES.length).find(
      (s) => s.item.slug === article.slug,
    );
    return found?.reasons ?? [];
  }, [profile, article]);

  const nextUp = useMemo(() => {
    if (!article) return [];
    if (profile) {
      return recommendArticles(profile, 6)
        .filter((s) => s.item.slug !== article.slug)
        .slice(0, 3)
        .map((s) => ({ article: s.item, reasons: s.reasons }));
    }
    return ARTICLES.filter((a) => a.slug !== article.slug)
      .slice(0, 3)
      .map((a) => ({ article: a, reasons: undefined as string[] | undefined }));
  }, [profile, article]);

  const featuredCard = useMemo(() => {
    if (profile) {
      return recommendCards(profile, 1)[0]?.item ?? CARDS[0];
    }
    return CARDS[0];
  }, [profile]);

  if (!article) {
    notFound();
  }

  function handleSave() {
    if (!profile || !article) return;
    toggleSaved(article.slug);
    setSaved((v) => !v);
  }

  const date = publishedDate(article.slug);
  const initials = AUTHOR.name
    .split(" ")
    .map((w) => w[0])
    .join("");

  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        {/* META STRIP */}
        <section className="border-b border-tpg-border">
          <div className="mx-auto max-w-3xl px-7 py-10 sm:px-7 lg:px-8">
            <nav className="text-xs text-tpg-gray-500">
              <Link href={profile ? "/dashboard" : "/"} className="hover:text-tpg-blue">
                Home
              </Link>
              <span className="mx-2">·</span>
              <span>{article.category}</span>
            </nav>
            <p className="mt-6 text-[11px] font-bold uppercase tracking-widest text-tpg-blue">
              {article.category}
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-tpg-ink sm:text-4xl md:text-5xl">
              {article.title}
            </h1>
            <p className="mt-4 text-lg text-tpg-gray-700">{article.excerpt}</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-tpg-blue-soft text-sm font-bold text-tpg-blue">
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-tpg-ink">
                    {AUTHOR.name}
                  </p>
                  <p className="text-xs text-tpg-gray-500">{AUTHOR.title}</p>
                </div>
              </div>
              <span className="h-8 w-px bg-tpg-border" />
              <p className="text-xs text-tpg-gray-500">
                Published {date} · {article.readTime}
              </p>
              <div className="flex items-center gap-1 text-tpg-gray-500 sm:ml-auto">
                <ShareButton
                  icon={MessageCircle}
                  label="Share on Twitter"
                  onClick={copyLink}
                />
                <ShareButton
                  icon={Globe}
                  label="Share on Facebook"
                  onClick={copyLink}
                />
                <ShareButton
                  icon={Mail}
                  label="Share by email"
                  onClick={copyLink}
                />
                <ShareButton
                  icon={LinkIcon}
                  label="Copy link"
                  onClick={copyLink}
                />
              </div>
            </div>
            {profile && personalReasons.length > 0 && (
              <div className="mt-6">
                <RecommendationBadge reasons={personalReasons} variant="rail" />
              </div>
            )}
          </div>
        </section>

        {/* HERO IMAGE */}
        <div className="mx-auto max-w-5xl px-7 sm:px-7 lg:px-8">
          <div
            className={`relative mt-8 aspect-[16/9] w-full overflow-hidden bg-gradient-to-br ${article.hero}`}
          />
          <p className="mt-2 text-xs italic text-tpg-gray-500">
            Illustrative photo · Editorial team
          </p>
        </div>

        {/* TOOLBAR */}
        <div className="mx-auto max-w-2xl px-7 pt-6 sm:px-7 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 border-b border-tpg-border pb-4">
            <button
              onClick={handleSave}
              disabled={!profile}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                saved
                  ? "border-tpg-blue bg-tpg-blue text-white"
                  : "border-tpg-border bg-white text-tpg-ink hover:border-tpg-blue"
              } disabled:opacity-50`}
            >
              {saved ? (
                <BookmarkCheck className="h-4 w-4" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
              {saved ? "Saved" : "Save"}
            </button>
            <button
              type="button"
              onClick={copyLink}
              className="inline-flex items-center gap-2 rounded-full border border-tpg-border bg-white px-4 py-2 text-sm font-semibold text-tpg-ink hover:border-tpg-blue"
            >
              <Share2 className="h-4 w-4" /> Share
            </button>
            {copied && (
              <span className="inline-flex items-center gap-1 rounded-md bg-tpg-blue-soft px-2 py-1 text-xs font-semibold text-tpg-blue">
                Copied!
              </span>
            )}
            {!profile && (
              <Link
                href="/signup"
                className="w-full text-xs font-semibold text-tpg-blue hover:underline sm:ml-auto sm:w-auto"
              >
                Sign up to save and personalize →
              </Link>
            )}
          </div>
        </div>

        {/* BODY */}
        <article className="mx-auto max-w-2xl px-7 py-10 sm:px-7 lg:px-8">
          <div className="font-serif text-[18px] leading-[1.7] text-tpg-ink-2">
            {(article.body ?? []).map((p, i) => (
              <p
                key={p.slice(0, 20)}
                className={`mt-5 ${i === 0 ? "text-xl font-medium text-tpg-ink" : ""}`}
              >
                {p}
              </p>
            ))}

            {/* KEY TAKEAWAY callout */}
            <aside className="my-10 border-l-4 border-tpg-red bg-bg-cream p-5">
              <p className="font-sans text-xs font-bold uppercase tracking-widest text-tpg-red">
                Key takeaway
              </p>
              <p className="mt-2 font-sans text-base text-tpg-ink">
                The fastest gains in points and miles come from picking the
                right currency, learning one sweet spot, and earning your first
                bonus before chasing the next.
              </p>
            </aside>

            {/* MID-ARTICLE NEWSLETTER */}
            <aside className="my-12 border-y border-tpg-border bg-bg-cream px-6 py-8 text-center">
              <p className="font-sans text-[11px] font-bold uppercase tracking-widest text-tpg-blue">
                Get The Points Guy in your inbox
              </p>
              <h3 className="mt-2 font-sans text-xl font-bold tracking-tight text-tpg-ink">
                Weekly briefing — handpicked
                {profile?.name ? ` for ${profile.name.split(" ")[0]}` : ""}
              </h3>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="mx-auto mt-4 flex max-w-md gap-2"
              >
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 border border-tpg-border bg-white px-3 py-2 text-sm focus:outline-none focus:border-tpg-blue"
                />
                <button
                  type="submit"
                  className="rounded-md bg-tpg-blue px-5 py-2 text-sm font-bold text-white hover:bg-tpg-navy"
                >
                  Subscribe
                </button>
              </form>
            </aside>

            <p className="mt-5 text-tpg-gray-500">
              This is a prototype article. The Points Guy redesign would render
              the full editorial layout here — pull quotes, tables, embedded
              card recommendations, and inline guides — all personalized to the
              reader.
            </p>
          </div>
        </article>

        {/* FEATURED CARD */}
        <aside className="border-y border-tpg-border bg-white">
          <div className="mx-auto max-w-3xl px-7 py-10 sm:px-7 lg:px-8">
            <p className="text-[11px] font-bold uppercase tracking-widest text-tpg-blue">
              The card we&apos;d pair with this article
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-tpg-ink">
              Editor&apos;s pick
            </h2>
            <div className="mt-6">
              <CardModule
                card={featuredCard}
                matchLabel="Editor's pick"
                layout="grid"
              />
            </div>
          </div>
        </aside>

        {/* RELATED READING */}
        {nextUp.length > 0 && (
          <section className="bg-white">
            <div className="mx-auto max-w-7xl px-7 py-12 sm:px-7 lg:px-8">
              <h2 className="border-b border-tpg-border pb-4 text-3xl font-bold tracking-tight text-tpg-ink">
                Related reading
              </h2>
              <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                {nextUp.map(({ article: a, reasons }) => (
                  <ArticleCard
                    key={a.slug}
                    article={a}
                    reasons={reasons}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}

function ShareButton({
  icon: Icon,
  label,
  onClick,
}: Readonly<{
  icon: typeof MessageCircle;
  label: string;
  onClick?: () => void;
}>) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="rounded-full p-2 hover:bg-tpg-gray-50 hover:text-tpg-blue"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

function publishedDate(slug: string) {
  const seed = (slug.codePointAt(0) ?? 0) + slug.length;
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[seed % 12]} ${(seed % 27) + 1}, 2025`;
}
