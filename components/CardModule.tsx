import Link from "next/link";
import type { CreditCard } from "@/lib/types";
import { RecommendationBadge } from "./RecommendationBadge";
import { Check } from "lucide-react";

export function CardModule({
  card,
  reasons,
  matchLabel = "Great match",
  layout = "grid",
}: Readonly<{
  card: CreditCard;
  reasons?: string[];
  matchLabel?: string;
  layout?: "grid" | "slab";
}>) {
  const container =
    layout === "slab"
      ? "flex flex-col gap-4 border-b border-tpg-border bg-white px-4 py-6 sm:flex-row sm:gap-6 sm:px-6"
      : "flex flex-col gap-4 border border-tpg-border bg-white p-5";

  return (
    <div className={container}>
      {/* Mock credit card face */}
      <div
        className={`relative h-32 w-52 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br ${card.color} p-3 text-white shadow-md ring-1 ring-black/10`}
      >
        <div className="text-[9px] font-bold uppercase tracking-widest opacity-80">
          {card.issuer}
        </div>
        <div className="mt-3 text-[12px] font-bold leading-tight">
          {card.name}
        </div>
        <div className="absolute bottom-3 left-3 text-[9px] font-bold uppercase tracking-widest opacity-80">
          {card.network}
        </div>
        <div className="absolute right-3 top-9 h-5 w-7 rounded-sm bg-amber-300/80" />
        <div className="absolute bottom-3 right-3 flex gap-0.5">
          <span className="h-3 w-0.5 rounded-full bg-white/60" />
          <span className="h-3 w-0.5 rounded-full bg-white/40" />
          <span className="h-3 w-0.5 rounded-full bg-white/20" />
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-tpg-blue-soft px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-tpg-blue">
            {matchLabel}
          </span>
          <span className="text-[11px] font-semibold text-tpg-gray-500">
            ${card.annualFee} annual fee
          </span>
        </div>
        <h3 className="text-lg font-bold tracking-tight text-tpg-ink">
          {card.name}
        </h3>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-tpg-gray-500">
            Welcome Bonus
          </p>
          <p className="text-2xl font-bold text-tpg-ink">
            {card.bonusPoints.toLocaleString()} pts
          </p>
          <p className="text-xs text-tpg-gray-500">{card.bonusRequirement}</p>
        </div>
        <ul className="grid gap-1.5">
          {card.highlights.map((h) => (
            <li
              key={h}
              className="flex items-start gap-2 text-sm text-tpg-gray-700"
            >
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-tpg-blue" />
              <span>{h}</span>
            </li>
          ))}
        </ul>
        {reasons && reasons.length > 0 && (
          <RecommendationBadge reasons={reasons} />
        )}
        <div className="mt-1 flex items-center gap-3">
          <Link
            href="/signup"
            className="rounded-full bg-tpg-blue px-5 py-2 text-sm font-semibold text-white hover:bg-tpg-navy"
          >
            Apply now
          </Link>
          <Link
            href="/article/premium-card-showdown"
            className="text-sm font-semibold text-tpg-blue hover:underline"
          >
            Read review
          </Link>
        </div>
      </div>
    </div>
  );
}
