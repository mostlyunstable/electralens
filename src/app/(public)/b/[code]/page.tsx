import { notFound } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Printer,
  ExternalLink,
  ShieldAlert,
  ArrowLeft,
  Building,
  Info,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PrintButton } from "@/components/ui/print-button";
import { getBooth, syntheticBooths } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return syntheticBooths.map((b) => ({ code: b.code }));
}

interface PageProps {
  params: Promise<{ code: string }>;
}

export default async function BoothDetailPage({ params }: PageProps) {
  const { code } = await params;
  const booth = getBooth(code);

  if (!booth) {
    notFound();
  }

  return (
    <div className="max-w-[960px] mx-auto px-4 md:px-8 py-10 md:py-16">
      {/* Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to homepage
        </Link>

        <PrintButton />
      </div>

      {/* Main Booth Card */}
      <div className="bg-surface border border-border rounded-md p-6 md:p-8 space-y-6 shadow-xs">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-data text-xs font-bold bg-background px-2.5 py-1 border border-border rounded-sm">
                POLLING BOOTH {booth.code}
              </span>
              <Badge variant="synthetic">Fictional Station Fixture</Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {booth.name}
            </h1>
          </div>
          <div className="text-right text-xs text-muted font-data">
            Last verified: {formatDate(booth.lastVerified)}
          </div>
        </div>

        {/* Location & Address */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-accent" /> Physical Address (Synthetic)
              </p>
              <p className="text-sm text-foreground/90 font-medium leading-relaxed">
                {booth.address}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted mb-1 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-muted" /> Electoral Roll Sections &amp; Parts Served
              </p>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {booth.partsServed.map((part) => (
                  <span
                    key={part}
                    className="font-data text-xs bg-background border border-border px-2 py-0.5 rounded text-foreground"
                  >
                    {part}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted mb-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-verified" /> Accessibility Assessment
              </p>
              <p className="text-sm text-foreground/90 leading-relaxed">
                {booth.accessibilityNotes}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted mb-1">
                Data Provenance
              </p>
              <p className="text-xs text-muted leading-relaxed">
                {booth.source}. This is a synthetic mock record created solely for testing polling-station lookup routing and accessibility rendering.
              </p>
            </div>
          </div>
        </div>

        {/* Official Links & Notice */}
        <div className="pt-6 border-t border-border flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          <p className="text-muted leading-relaxed max-w-[500px]">
            To find your actual official polling station, visit the Election Commission of India's National Voter Services Portal.
          </p>
          <a
            href="https://electoralsearch.eci.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-foreground text-surface font-semibold rounded hover:bg-foreground/90 transition-colors shrink-0"
          >
            Official ECI Search <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
