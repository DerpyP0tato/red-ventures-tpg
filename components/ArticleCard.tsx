import Link from "next/link";
import type { Article } from "@/lib/types";
import { RecommendationBadge } from "./RecommendationBadge";

const TITLE_SIZE: Record<"sm" | "md" | "lg", string> = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-2xl",
};

export function ArticleCard({
  article,
  reasons,
  size = "md",
  badge,
}: Readonly<{
  article: Article;
  reasons?: string[];
  size?: "sm" | "md" | "lg";
  badge?: "Limited-time" | "New Offer";
}>) {
  const date = publishedDate(article.slug);
  const isDeal = article.category === "Deal";
  const showBadge = badge ?? (isDeal ? "Deal" : null);

  return (
    <Link
      href={`/article/${article.slug}`}
      className="group flex flex-col gap-3"
    >
      <div className="relative aspect-[5/4] w-full overflow-hidden bg-tpg-gray-100">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${article.hero} transition-transform duration-300 group-hover:scale-105`}
        />
        {showBadge && (
          <span className="absolute left-3 top-3 rounded-sm bg-tpg-red px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            {showBadge}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <p className="text-[11px] font-bold uppercase tracking-wider text-tpg-blue">
          {article.category}
        </p>
        <h3
          className={`${TITLE_SIZE[size]} font-bold tracking-tight text-tpg-ink leading-snug group-hover:text-tpg-blue`}
        >
          {article.title}
        </h3>
        {size !== "sm" && (
          <p className="line-clamp-2 text-sm text-tpg-gray-500">
            {article.excerpt}
          </p>
        )}
        <p className="mt-auto text-xs text-tpg-gray-500">
          Published {date} · {article.readTime}
        </p>
        {reasons && reasons.length > 0 && (
          <RecommendationBadge reasons={reasons} />
        )}
      </div>
    </Link>
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
  const month = months[seed % 12];
  const day = (seed % 27) + 1;
  return `${month} ${day}, 2025`;
}
