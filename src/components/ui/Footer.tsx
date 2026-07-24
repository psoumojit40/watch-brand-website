import Link from "next/link";
import { BRAND, ROUTES } from "@/lib/constants";

const footerLinks = [
  {
    title: "Collections",
    links: [
      { label: "Royal Oak", href: `${ROUTES.collections}/royal-oak` },
      { label: "Royal Oak Offshore", href: `${ROUTES.collections}/royal-oak-offshore` },
      { label: "Code 11.59", href: `${ROUTES.collections}/code-1159` },
    ],
  },
  {
    title: "Maison",
    links: [
      { label: "Heritage", href: ROUTES.heritage },
      { label: "Timeline", href: ROUTES.timeline },
      { label: "Atelier", href: ROUTES.heritage },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Care & Service", href: "#" },

      { label: "Find a Boutique", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="section-navy relative border-t border-gold/15">
      {/* Gold gradient hairline sitting on the top edge for clean separation */}
      <div className="divider-gold absolute inset-x-0 top-0" />
      <div className="mx-auto max-w-7xl px-6 py-16">

        <div className="mb-12 grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-bold tracking-widest text-cream uppercase">
              {BRAND.name.split(" ")[0]}
              <span className="text-gold">.</span>
            </h3>
            <p className="max-w-xs text-xs leading-relaxed text-cream/40">
              {BRAND.description}
            </p>
          </div>
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="mb-4 text-xs font-medium tracking-[0.2em] uppercase text-gold">
                {group.title}
              </h4>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-cream/50 transition-colors hover:text-cream"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/5 pt-8 text-center text-xs text-cream/30">
          &copy; {new Date().getFullYear()} {BRAND.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
