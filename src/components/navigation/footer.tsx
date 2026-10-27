import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const footerSections = [
  {
    title: "Analysis",
    links: [
      { href: "/compare", label: "Compare versions" },
      { href: "/findings", label: "Findings directory" },
      { href: "/claims", label: "Check a claim" },
      { href: "/methodology", label: "Methodology" },
    ],
  },
  {
    title: "Transparency",
    links: [
      { href: "/verify/PUB-2024-001", label: "Verify a publication" },
      { href: "/sources", label: "Data sources" },
      { href: "/about", label: "About ElectraLens" },
      { href: "/privacy", label: "Privacy practices" },
    ],
  },
  {
    title: "Official resources",
    links: [
      {
        href: "https://eci.gov.in",
        label: "Election Commission of India",
        external: true,
      },
      {
        href: "https://nvsp.in",
        label: "National Voter Services Portal",
        external: true,
      },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface" role="contentinfo">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        {/* Main Footer Grid */}
        <div className="py-12 md:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <Image
                src="/emblem.png"
                alt="ElectraLens Emblem"
                width={36}
                height={36}
                className="h-9 w-auto object-contain"
              />
              <div className="flex flex-col leading-none">
                <div className="flex items-center">
                  <span className="text-lg font-bold tracking-tight text-foreground font-serif">
                    Electra
                  </span>
                  <span className="text-lg font-bold tracking-tight text-[#C58B39] font-serif">
                    Lens
                  </span>
                </div>
                <span className="text-[7.5px] font-semibold tracking-widest uppercase text-muted -mt-0.5">
                  Electoral Roll Transparency
                </span>
              </div>
            </Link>
            <p className="text-sm text-muted leading-relaxed max-w-[280px]">
              Independent civic-tech project examining changes between
              electoral-roll versions through published statistical methodology.
            </p>
          </div>

          {/* Link Columns */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-[11px] font-semibold tracking-widest uppercase text-muted mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground transition-colors"
                      >
                        {link.label}
                        <ArrowUpRight className="w-3 h-3 opacity-50" />
                        <span className="sr-only">(opens in new tab — external official resource)</span>
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-muted hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-xs text-muted leading-relaxed max-w-[600px]">
            ElectraLens is an independent civic-tech project. It is not
            affiliated with or endorsed by the Election Commission of India.
            All data shown during the hackathon is synthetic and fictional.
          </p>
          <p className="text-xs text-muted/60 font-data whitespace-nowrap">
            Methodology v1.0.0 · Synthetic dataset
          </p>
        </div>
      </div>
    </footer>
  );
}
