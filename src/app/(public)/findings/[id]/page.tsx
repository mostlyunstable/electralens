import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
  Scale,
  Calendar,
  Layers,
  FileText,
  Hash,
  ExternalLink,
  ChevronRight,
  Info,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getFinding, findings } from "@/lib/data";
import { formatNumber } from "@/lib/utils";

// Generate static params for synthetic demonstration findings
export function generateStaticParams() {
  return findings.map((f) => ({ id: f.id }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function FindingDetailPage({ params }: PageProps) {
  const { id } = await params;
  const finding = getFinding(id);

  if (!finding) {
    notFound();
  }

  const observedRate = (finding.observedValue / finding.denominator) * 100;
  const expectedRate = (finding.expectedBaseline / finding.denominator) * 100;

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-10 md:py-16">
      {/* Back Link */}
      <div className="mb-6">
        <Link
          href="/findings"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to findings directory
        </Link>
      </div>

      {/* Header Banner */}
      <div className="bg-surface border border-border rounded-md p-6 md:p-8 mb-8 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="font-data text-xs font-bold bg-background px-2.5 py-1 border border-border rounded-sm">
              {finding.id}
            </span>
            <Badge
              variant={
                finding.signalStrength === "strong"
                  ? "signal-strong"
                  : finding.signalStrength === "moderate"
                    ? "signal-moderate"
                    : "signal-weak"
              }
            >
              {finding.signalStrength} statistical signal
            </Badge>
            <Badge
              variant={`status-${finding.reviewStatus}` as "status-published" | "status-pending" | "status-reviewed" | "status-disputed"}
            >
              Status: {finding.reviewStatus}
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-xs font-data text-muted">
            <span>Methodology v{finding.methodologyVersion}</span>
            <span>•</span>
            <Link
              href="/verify/PUB-2024-001"
              className="text-accent hover:underline flex items-center gap-1"
            >
              Verify manifest <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
          {finding.ruleName}
        </h1>
        <p className="text-base text-[#2563EB] font-semibold mb-4">
          {finding.area} <span className="text-muted font-normal font-data">({finding.areaCode})</span>
        </p>

        <p className="text-sm md:text-base text-foreground/85 leading-relaxed max-w-[840px]">
          {finding.explanation}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Quantitative Evidence & Rules (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Section: Statistical Metrics */}
          <div className="bg-surface border border-border rounded-md p-6">
            <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
              <Scale className="w-4 h-4 text-accent" />
              Observed Count vs. Expected Baseline
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-background/60 border border-border/80 rounded mb-6">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted mb-0.5">
                  Observed Count
                </p>
                <p className="font-data text-xl font-bold text-foreground">
                  {formatNumber(finding.observedValue)}
                </p>
                <p className="text-[11px] text-muted">
                  {observedRate.toFixed(2)}% of subunit
                </p>
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted mb-0.5">
                  Expected Baseline
                </p>
                <p className="font-data text-xl font-bold text-muted">
                  {formatNumber(finding.expectedBaseline)}
                </p>
                <p className="text-[11px] text-muted">
                  {expectedRate.toFixed(2)}% of subunit
                </p>
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted mb-0.5">
                  Denominator (Eligible)
                </p>
                <p className="font-data text-xl font-bold text-foreground">
                  {formatNumber(finding.denominator)}
                </p>
                <p className="text-[11px] text-muted">Subunit population</p>
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted mb-0.5">
                  Rate Ratio / Effect Size
                </p>
                <p className="font-data text-xl font-bold text-[#F07824]">
                  {finding.rateRatio.toFixed(2)}×
                </p>
                <p className="text-[11px] text-muted">Δ = +{finding.effectSize.toFixed(2)}</p>
              </div>
            </div>

            {/* Evidence Breakdown Table */}
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">
              Statistical Test Rigor &amp; Assumptions
            </h3>
            <div className="border border-border rounded overflow-hidden">
              <table className="w-full text-xs">
                <tbody className="divide-y divide-border/60">
                  <tr className="bg-background/40">
                    <td className="py-2.5 px-4 font-semibold text-muted w-1/3">Statistical Test Model</td>
                    <td className="py-2.5 px-4 font-medium text-foreground">{finding.statisticalTest}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-semibold text-muted">Raw p-value</td>
                    <td className="py-2.5 px-4 font-data text-foreground">{finding.pValue}</td>
                  </tr>
                  <tr className="bg-background/40">
                    <td className="py-2.5 px-4 font-semibold text-muted">95% Confidence Interval</td>
                    <td className="py-2.5 px-4 font-data text-foreground">
                      [{finding.confidenceInterval[0].toFixed(2)}, {finding.confidenceInterval[1].toFixed(2)}]
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-semibold text-muted">Multiple Testing Adjustment</td>
                    <td className="py-2.5 px-4 text-foreground">Benjamini-Hochberg False Discovery Rate (FDR)</td>
                  </tr>
                  <tr className="bg-background/40">
                    <td className="py-2.5 px-4 font-semibold text-muted">Adjusted q-value</td>
                    <td className="py-2.5 px-4 font-data font-bold text-foreground">
                      {finding.adjustedQValue < 0.001 ? "< 0.001" : finding.adjustedQValue.toFixed(4)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-semibold text-muted">Simultaneous Tests Run</td>
                    <td className="py-2.5 px-4 font-data text-foreground">{finding.testsPerformed} assembly subunits</td>
                  </tr>
                  <tr className="bg-background/40">
                    <td className="py-2.5 px-4 font-semibold text-muted">Formal Detection Criterion</td>
                    <td className="py-2.5 px-4 font-data text-foreground">{finding.detectionCriterion}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section: Plausible Alternative Explanations */}
          <div className="bg-surface border border-border rounded-md p-6">
            <h2 className="text-base font-bold text-foreground mb-2 flex items-center gap-2">
              <Info className="w-4 h-4 text-caution" />
              Plausible Alternative Explanations (Non-Misconduct)
            </h2>
            <p className="text-xs text-muted mb-4 leading-relaxed">
              Every statistical pattern must be evaluated against innocent contextual explanations before any inference is made.
              The presence of an anomaly does not establish fraudulent intent or misconduct.
            </p>

            <div className="space-y-3">
              {finding.alternativeExplanations.map((alt, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-background border border-border rounded flex items-start gap-3"
                >
                  <span className="font-data text-xs text-accent font-bold mt-0.5">
                    H_{idx + 1}:
                  </span>
                  <p className="text-xs md:text-sm text-foreground/85 leading-relaxed">
                    {alt}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Known Limitations */}
          <div className="bg-surface border border-border rounded-md p-6">
            <h2 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-muted" />
              Analytical Limitations &amp; Uncertainty
            </h2>
            <ul className="space-y-2 text-xs md:text-sm text-muted">
              {finding.limitations.map((lim, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>{lim}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Provenance, Audit History & Cryptography (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Metadata Card */}
          <div className="bg-surface border border-border rounded-md p-5 text-xs space-y-4">
            <h3 className="font-bold text-foreground uppercase tracking-wider text-[11px] border-b border-border pb-2">
              Provenance &amp; Versioning
            </h3>

            <div>
              <p className="text-muted text-[10px] uppercase font-semibold">Rule Identifier</p>
              <p className="font-data font-bold text-foreground mt-0.5">{finding.ruleId} (v{finding.ruleVersion})</p>
            </div>

            <div>
              <p className="text-muted text-[10px] uppercase font-semibold">Baseline Dataset</p>
              <p className="font-data text-foreground mt-0.5">{finding.baselineVersion}</p>
            </div>

            <div>
              <p className="text-muted text-[10px] uppercase font-semibold">Target Dataset</p>
              <p className="font-data text-foreground mt-0.5">{finding.targetVersion}</p>
            </div>

            <div>
              <p className="text-muted text-[10px] uppercase font-semibold">Category</p>
              <p className="text-foreground mt-0.5 capitalize">{finding.category.replace("-", " ")}</p>
            </div>

            <div>
              <p className="text-muted text-[10px] uppercase font-semibold">Publication Manifest</p>
              <Link href="/verify/PUB-2024-001" className="font-data text-accent hover:underline mt-0.5 block">
                PUB-2024-001 (Rev 1)
              </Link>
            </div>
          </div>

          {/* Audit & Review History */}
          <div className="bg-surface border border-border rounded-md p-5 text-xs">
            <h3 className="font-bold text-foreground uppercase tracking-wider text-[11px] border-b border-border pb-2 mb-3">
              Public Review Log
            </h3>
            <div className="space-y-3 font-data text-[11px]">
              <div className="border-l-2 border-verified pl-3">
                <p className="font-bold text-foreground">Publication Approved</p>
                <p className="text-muted text-[10px]">2024-04-20 14:00 UTC</p>
                <p className="text-muted mt-0.5">Approved under dual-analyst protocol</p>
              </div>

              <div className="border-l-2 border-accent pl-3">
                <p className="font-bold text-foreground">Statistical Peer Review</p>
                <p className="text-muted text-[10px]">2024-04-18 11:20 UTC</p>
                <p className="text-muted mt-0.5">Alternative demographic hypotheses verified</p>
              </div>

              <div className="border-l-2 border-muted pl-3">
                <p className="font-bold text-foreground">Algorithmic Detection</p>
                <p className="text-muted text-[10px]">2024-04-15 10:30 UTC</p>
                <p className="text-muted mt-0.5">Batch execution against v2024-Q2-final</p>
              </div>
            </div>
          </div>

          {/* Integrity Assurance Callout */}
          <div className="bg-dark-surface text-dark-text border border-border rounded-md p-5 text-xs space-y-3">
            <div className="flex items-center gap-1.5 text-verified font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Independent Verification</span>
            </div>
            <p className="text-white/70 leading-relaxed text-[11px]">
              The evidence parameters for this finding are hashed in publication manifest PUB-2024-001. You can independently verify the SHA-256 digest in your browser.
            </p>
            <Link
              href="/verify/PUB-2024-001"
              className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline pt-1"
            >
              Verify this record &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
