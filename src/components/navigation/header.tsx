"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/compare", label: "Compare" },
  { href: "/findings", label: "Findings" },
  { href: "/methodology", label: "Methodology" },
  { href: "/claims", label: "Claims" },
  { href: "/sources", label: "Sources" },
];

const moreLinks = [
  { href: "/about", label: "About" },
  { href: "/privacy", label: "Privacy" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [locale, setLocale] = useState<"en" | "hi">("en");
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Trap focus in mobile menu
  useEffect(() => {
    if (mobileOpen && mobileMenuRef.current) {
      const focusable = mobileMenuRef.current.querySelectorAll(
        'a, button, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length > 0) {
        (focusable[0] as HTMLElement).focus();
      }
    }
  }, [mobileOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Wordmark & Emblem Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-full"
            aria-label="ElectraLens home"
          >
            <Image
              src="/emblem.png"
              alt="ElectraLens Emblem"
              width={38}
              height={38}
              className="h-8 md:h-9 w-auto object-contain transition-transform group-hover:scale-105"
              priority
            />
            <div className="flex flex-col leading-none">
              <div className="flex items-center">
                <span className="text-xl md:text-2xl font-normal tracking-tight text-[#172033] font-serif">
                  Electra
                </span>
                <span className="text-xl md:text-2xl font-normal tracking-tight text-[#F07824] font-serif">
                  Lens
                </span>
              </div>
              <span className="text-[8px] font-bold tracking-[0.14em] uppercase text-[#475467] -mt-0.5 hidden sm:block">
                Electoral Roll Transparency
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden lg:flex items-center gap-1.5"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 text-[15px] font-bold rounded-full transition-all",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                    isActive
                      ? "text-[#172033] bg-[#F7F8FA]"
                      : "text-[#475467] hover:text-[#172033] hover:bg-[#F7F8FA]/60"
                  )}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-1.5 left-4 right-4 h-[2px] bg-[#F07824] rounded-full"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language selector */}
            <button
              onClick={() => setLocale(locale === "en" ? "hi" : "en")}
              className="btn-pill-sm btn-subtle text-xs"
              aria-label={`Switch language to ${locale === "en" ? "Hindi" : "English"}`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{locale === "en" ? "EN" : "हि"}</span>
            </button>

            {/* Verify CTA */}
            <Link
              href="/verify/PUB-2024-001"
              className="btn-pill-sm btn-orange shadow-xs"
            >
              Verify
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-foreground rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Synthetic Data Banner */}
      <div className="bg-caution/5 border-t border-caution/20">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-1">
          <p className="text-[11px] font-medium tracking-wide text-caution text-center">
            ⚠ DEMONSTRATION MODE — All data shown is synthetic and fictional
          </p>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 top-[calc(3.5rem+28px)] bg-foreground/20 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              ref={mobileMenuRef}
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="fixed top-[calc(3.5rem+28px)] left-0 right-0 bg-surface border-b border-border z-50 lg:hidden max-h-[calc(100vh-4.5rem)] overflow-y-auto"
            >
              <nav className="p-4 space-y-1" aria-label="Mobile navigation">
                {[...navLinks, ...moreLinks].map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "block px-3 py-2.5 text-sm font-medium rounded-sm transition-colors",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                        isActive
                          ? "text-accent bg-accent/5"
                          : "text-foreground hover:bg-background"
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
                <div className="pt-3 mt-3 border-t border-border">
                  <Link
                    href="/verify/PUB-2024-001"
                    className="block px-3 py-2.5 text-sm font-medium text-surface bg-foreground rounded-sm text-center"
                  >
                    Verify a publication
                  </Link>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setLocale(locale === "en" ? "hi" : "en");
                      setMobileOpen(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-muted"
                  >
                    <Globe className="w-4 h-4" />
                    {locale === "en" ? "Switch to Hindi" : "Switch to English"}
                  </button>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
