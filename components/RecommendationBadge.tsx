import { Sparkles } from "lucide-react";

export function RecommendationBadge({
  reasons,
  variant = "soft",
}: Readonly<{
  reasons: string[];
  variant?: "soft" | "ghost" | "rail";
}>) {
  if (!reasons.length) return null;
  const primary = reasons[0];
  const rest = reasons.slice(1);

  if (variant === "rail") {
    return (
      <div className="border-l-2 border-tpg-teal pl-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-tpg-teal-deep">
          For you
        </p>
        <p className="text-xs text-tpg-gray-700">
          because {decapitalize(primary)}
        </p>
      </div>
    );
  }

  const base =
    variant === "soft"
      ? "bg-tpg-blue-soft text-tpg-blue"
      : "bg-white/15 text-white";

  return (
    <div className="space-y-1">
      <span
        className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-semibold ${base}`}
      >
        <Sparkles className="h-3 w-3" />
        Recommended because {decapitalize(primary)}
      </span>
      {rest.length > 0 && (
        <p className="text-[11px] leading-snug text-tpg-gray-500">
          + {rest.map(decapitalize).join(" · ")}
        </p>
      )}
    </div>
  );
}

function decapitalize(s: string) {
  if (!s) return s;
  return s.charAt(0).toLowerCase() + s.slice(1);
}
