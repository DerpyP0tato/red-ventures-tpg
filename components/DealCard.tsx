import { Clock, Sparkles } from "lucide-react";
import type { Deal, Tag } from "@/lib/types";
import { RecommendationBadge } from "./RecommendationBadge";

export function DealCard({
  deal,
  reasons,
}: Readonly<{ deal: Deal; reasons?: string[] }>) {
  const initials = deal.partner
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  const category = dealCategory(deal.tags);
  const isUrgent = /day|hour|sunday|today/i.test(deal.endsOn);

  return (
    <div className="group flex flex-col overflow-hidden border border-tpg-border bg-white transition hover:border-tpg-blue/40 hover:shadow-md">
      <div className="flex items-center justify-between border-b border-tpg-border bg-bg-cream px-4 py-2.5">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-tpg-blue">
          <Sparkles className="h-3 w-3" />
          {category}
        </span>
        <span
          className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider ${
            isUrgent ? "text-tpg-red" : "text-tpg-gray-500"
          }`}
        >
          <Clock className="h-3 w-3" />
          {deal.endsOn}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-tpg-navy to-tpg-blue text-[10px] font-bold text-white">
            {initials}
          </div>
          <span className="truncate text-xs font-semibold text-tpg-gray-700">
            {deal.partner}
          </span>
        </div>

        <h3 className="text-base font-bold tracking-tight leading-snug text-tpg-ink group-hover:text-tpg-blue">
          {deal.title}
        </h3>

        <div className="rounded-md border border-tpg-blue/20 bg-tpg-blue-soft px-3 py-2.5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-tpg-blue">
            The deal
          </p>
          <p className="mt-0.5 text-sm font-bold text-tpg-ink">{deal.perk}</p>
        </div>

        {reasons && reasons.length > 0 && (
          <RecommendationBadge reasons={reasons} />
        )}
      </div>
    </div>
  );
}

function dealCategory(tags: Tag[]): string {
  if (tags.includes("transfer-partners")) return "Transfer Bonus";
  if (tags.includes("award-bookings")) return "Award Space";
  if (tags.includes("luxury-hotels")) return "Hotel Promo";
  return "Flash Deal";
}
