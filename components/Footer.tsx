import { Globe, Camera, MessageCircle, Play, Rss } from "lucide-react";
import { Logo } from "./Logo";

const SOCIALS = [
  { icon: Globe, label: "Facebook" },
  { icon: Camera, label: "Instagram" },
  { icon: MessageCircle, label: "Twitter" },
  { icon: Play, label: "YouTube" },
  { icon: Rss, label: "RSS" },
];

const MEET_TPG = [
  "About",
  "Team",
  "Editorial guidelines",
  "Careers",
  "Contact",
];

const EXPLORE = [
  "News",
  "Credit Cards",
  "Points & Miles",
  "Reviews",
  "Travel",
  "Deals",
];

const LEGAL = [
  "Terms",
  "Privacy",
  "Cookies",
  "Do Not Sell",
  "Accessibility",
  "Advertising disclosure",
];

const TRANSPARENCY = [
  "Editorial standards",
  "Advertiser policy",
  "How we make money",
  "Corrections",
  "Diversity",
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-tpg-border bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-7 py-12 sm:px-7 md:grid-cols-6 lg:px-8">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-md text-sm text-tpg-gray-500">
            Maximize your points, miles, and travel rewards — handpicked daily.
          </p>
          <div className="mt-5 flex items-center gap-3 text-tpg-gray-700">
            {SOCIALS.map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="/"
                aria-label={label}
                className="rounded-full p-2 hover:bg-tpg-gray-50 hover:text-tpg-blue"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
          <form
            className="mt-5 flex max-w-sm overflow-hidden rounded-md border border-tpg-border"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 bg-white px-3 py-2 text-sm placeholder:text-tpg-gray-500 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-tpg-blue px-4 py-2 text-sm font-semibold text-white hover:bg-tpg-navy"
            >
              Subscribe
            </button>
          </form>
        </div>
        <FooterColumn title="Meet TPG" items={MEET_TPG} />
        <FooterColumn title="Explore" items={EXPLORE} />
        <FooterColumn title="Legal" items={LEGAL} />
        <FooterColumn title="Transparency" items={TRANSPARENCY} />
      </div>
      <div className="border-t border-tpg-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-7 py-6 text-xs text-tpg-gray-500 sm:flex-row sm:px-7 lg:px-8">
          <p>Copyright © 2026 The Points Guy. Prototype only — not affiliated with any real brand.</p>
          <p>Built for a business case presentation.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  items,
}: Readonly<{ title: string; items: string[] }>) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-tpg-navy">
        {title}
      </p>
      <ul className="mt-3 space-y-2 text-sm text-tpg-gray-500">
        {items.map((i) => (
          <li key={i}>
            <a href="/" className="hover:text-tpg-blue">
              {i}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
