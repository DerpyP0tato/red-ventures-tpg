import type { Destination } from "@/lib/types";
import { RecommendationBadge } from "./RecommendationBadge";
import { MapPin } from "lucide-react";

export function DestinationCard({
  dest,
  reasons,
}: Readonly<{ dest: Destination; reasons?: string[] }>) {
  return (
    <div className="flex flex-col border border-tpg-border bg-white">
      <div
        className={`relative aspect-[5/4] w-full overflow-hidden bg-gradient-to-br ${dest.accent}`}
      >
        <div className="absolute inset-0 bg-black/20" />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-tpg-navy">
          <MapPin className="h-3 w-3" />
          {dest.region}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 border-t border-tpg-border px-4 py-4">
        <h3 className="text-lg font-bold tracking-tight text-tpg-ink">
          {dest.name}
        </h3>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-tpg-gray-500">
          Best: {dest.bestMonths}
        </p>
        <p className="text-sm text-tpg-gray-700">{dest.pointsTip}</p>
        {reasons && reasons.length > 0 && (
          <RecommendationBadge reasons={reasons} />
        )}
      </div>
    </div>
  );
}
