import Link from "next/link";
import {
  Lock,
  EyeOff,
  ShieldCheck,
  Database,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function PrivacyPage() {
  return (
    <div className="max-w-[960px] mx-auto px-4 md:px-8 py-10 md:py-16">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="verified">Privacy Policy</Badge>
          <span className="text-xs text-muted font-data">SECURITY CHARTER</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Privacy Practices &amp; Identity Protection
        </h1>
        <p className="text-base text-muted mt-2 leading-relaxed">
          How ElectraLens safeguards citizen privacy while delivering rigorous public electoral transparency.
        </p>
      </div>

      <div className="space-y-8 text-xs md:text-sm text-foreground/80 leading-relaxed">
        {/* Core Principle Callout */}
        <div className="p-6 bg-surface border border-border rounded-md space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-accent">
            Core Founding Principle
          </p>
          <p className="font-serif italic text-lg md:text-xl font-semibold text-foreground">
            "Public Data. Public Methodology. Public Evidence. Private Identities."
          </p>
          <p className="text-muted pt-2">
            Electoral transparency must never come at the expense of voter safety or privacy.
            ElectraLens enforces mathematical aggregation to ensure individual citizens can never be singled out, doxed, or targeted.
          </p>
        </div>

        {/* Section 1: Non-Disclosure of PII */}
        <section className="bg-surface border border-border rounded-md p-6 space-y-3">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-accent" />
            1. Zero Personally Identifiable Information (PII)
          </h2>
          <p>
            ElectraLens <strong>never</strong> displays, distributes, or exposes individual citizen records on its public routes. Specifically excluded:
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted pl-2">
            <li>Citizen full names or aliases</li>
            <li>Parent, spouse, or guardian names</li>
            <li>House numbers, residential addresses, or street locations</li>
            <li>Elector Photo Identity Card (EPIC) numbers</li>
            <li>Individual dates of birth or mobile telephone numbers</li>
          </ul>
        </section>

        {/* Section 2: Mathematical Aggregation */}
        <section className="bg-surface border border-border rounded-md p-6 space-y-3">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Database className="w-4 h-4 text-verified" />
            2. Minimum Cell Counts &amp; Aggregation Thresholds
          </h2>
          <p>
            All statistical findings and comparison workspaces are reported at the geographic level of assembly constituencies, municipal wards, or polling booth aggregates.
            To prevent re-identification through demographic intersection (k-anonymity violation), any statistical bucket with fewer than 10 individuals is suppressed or bundled.
          </p>
        </section>

        {/* Section 3: Web Analytics & Telemetry */}
        <section className="bg-surface border border-border rounded-md p-6 space-y-3">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Lock className="w-4 h-4 text-muted" />
            3. No Tracking Cookies, Ads, or Third-Party Telemetry
          </h2>
          <p>
            This website does not load external tracking scripts, behavioral advertising cookies, or cross-site fingerprinting beacons.
            Cryptographic verification executes locally inside your web browser using native Web Crypto APIs (<code className="font-data text-xs bg-background px-1 py-0.5 rounded">crypto.subtle</code>), meaning your verification queries are never sent to a tracking database.
          </p>
        </section>

        {/* Section 4: Responsible Disclosure */}
        <section className="bg-surface border border-border rounded-md p-6 space-y-3">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-accent" />
            4. Responsible Disclosure Policy
          </h2>
          <p>
            If you identify any data leak, unintended exposure of personal information, or statistical vulnerability on this platform, please notify our security team immediately at <span className="font-data text-accent">security@electralens.org</span>.
          </p>
        </section>
      </div>
    </div>
  );
}
