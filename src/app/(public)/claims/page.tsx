"use client";

import { useState } from "react";
import {
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Info,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { evaluateClaim, type ClaimResult, type ClaimVerdict } from "@/lib/data";

const sampleClaims = [
  {
    title: "Consistent Claim",
    area: "Vidyanagar Assembly",
    metric: "Addition rate",
    period: "January 2024 — April 2024",
    claimedValue: "4.4",
    direction: "equal to",
    description: "Claim that addition rate was ~4.4% in Vidyanagar.",
  },
  {
    title: "Contradicted Claim",
    area: "Lakshminagar Assembly",
    metric: "Deletion rate",
    period: "January 2024 — April 2024",
    claimedValue: "8.5",
    direction: "equal to",
    description: "Claim that deletions exceeded 8% in Lakshminagar (actual was 2.3%).",
  },
  {
    title: "Fraud / Intent Claim",
    area: "Rajpur Ward",
    metric: "Addition rate",
    period: "January 2024 — April 2024",
    claimedValue: "deliberate rigging and fraud",
    direction: "greater than",
    description: "Claim alleging fraudulent intent or criminal conspiracy.",
  },
  {
    title: "Missing / Out of Scope Area",
    area: "Central Metropolis District",
    metric: "Addition rate",
    period: "January 2024 — April 2024",
    claimedValue: "3.2",
    direction: "equal to",
    description: "Area not present in the published synthetic demonstration roll.",
  },
];

export default function ClaimCheckerPage() {
  const [area, setArea] = useState(sampleClaims[0].area);
  const [metric, setMetric] = useState(sampleClaims[0].metric);
  const [period, setPeriod] = useState(sampleClaims[0].period);
  const [claimedValue, setClaimedValue] = useState(sampleClaims[0].claimedValue);
  const [direction, setDirection] = useState(sampleClaims[0].direction);
  const [result, setResult] = useState<ClaimResult | null>(() =>
    evaluateClaim(sampleClaims[0].area, sampleClaims[0].metric, sampleClaims[0].period, sampleClaims[0].claimedValue, sampleClaims[0].direction)
  );

  const handleEvaluate = (e: React.FormEvent) => {
    e.preventDefault();
    const res = evaluateClaim(area, metric, period, claimedValue, direction);
    setResult(res);
  };

  const loadSample = (s: typeof sampleClaims[0]) => {
    setArea(s.area);
    setMetric(s.metric);
    setPeriod(s.period);
    setClaimedValue(s.claimedValue);
    setDirection(s.direction);
    setResult(evaluateClaim(s.area, s.metric, s.period, s.claimedValue, s.direction));
  };

  const getVerdictStyle = (verdict: ClaimVerdict) => {
    switch (verdict) {
      case "consistent":
        return {
          bg: "bg-verified/10",
          border: "border-verified/30",
          text: "text-verified",
          title: "Consistent with Published Aggregate Data",
          icon: CheckCircle2,
        };
      case "contradicted":
        return {
          bg: "bg-critical/10",
          border: "border-critical/30",
          text: "text-critical",
          title: "Contradicted by Published Aggregate Data",
          icon: XCircle,
        };
      case "cannot-establish":
        return {
          bg: "bg-caution/10",
          border: "border-caution/30",
          text: "text-caution",
          title: "Cannot Be Established From Statistical Data",
          icon: ShieldAlert,
        };
      case "disputed":
        return {
          bg: "bg-caution/10",
          border: "border-caution/30",
          text: "text-caution",
          title: "Disputed Across Official Records",
          icon: AlertTriangle,
        };
      case "insufficient-data":
      default:
        return {
          bg: "bg-muted/10",
          border: "border-muted/30",
          text: "text-muted",
          title: "Insufficient Data in Active Fixture",
          icon: HelpCircle,
        };
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-10 md:py-16">
      {/* Page Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="synthetic">Fact-Checking Tool</Badge>
          <span className="text-xs text-muted font-data">EVALUATOR: PUBLIC-DATA</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Structured Electoral Claim Checker
        </h1>
        <p className="text-sm md:text-base text-muted mt-2 max-w-[760px] leading-relaxed">
          Verify factual claims circulating in public discourse against published aggregate roll statistics.
          Claims about malicious intent or criminal conspiracy cannot be established from statistical data.
        </p>
      </div>

      {/* Pre-fill Sample Presets */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">
          Or test with pre-configured claim scenarios:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {sampleClaims.map((s, idx) => (
            <button
              key={idx}
              onClick={() => loadSample(s)}
              className="text-left p-3.5 bg-surface border border-border hover:border-foreground/40 rounded transition-all text-xs"
            >
              <span className="font-bold text-foreground block mb-1">{s.title}</span>
              <span className="text-muted text-[11px] line-clamp-2">{s.description}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Inputs (5 cols) */}
        <div className="lg:col-span-5 bg-surface border border-border rounded-md p-6">
          <h2 className="text-base font-bold text-foreground mb-4">
            Structured Claim Parameters
          </h2>
          <form onSubmit={handleEvaluate} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-muted mb-1.5 uppercase tracking-wide text-[10px]">
                Administrative Unit / Area
              </label>
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g. Vidyanagar Assembly"
                required
                className="w-full bg-background border border-border rounded p-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            <div>
              <label className="block font-semibold text-muted mb-1.5 uppercase tracking-wide text-[10px]">
                Reported Metric
              </label>
              <select
                value={metric}
                onChange={(e) => setMetric(e.target.value)}
                className="w-full bg-background border border-border rounded p-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <option value="Addition rate">Addition rate (%)</option>
                <option value="Deletion rate">Deletion rate (%)</option>
                <option value="Total records">Total electorate count</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-muted mb-1.5 uppercase tracking-wide text-[10px]">
                Revision Period
              </label>
              <input
                type="text"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                placeholder="e.g. January 2024 — April 2024"
                className="w-full bg-background border border-border rounded p-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-muted mb-1.5 uppercase tracking-wide text-[10px]">
                  Comparison Mode
                </label>
                <select
                  value={direction}
                  onChange={(e) => setDirection(e.target.value)}
                  className="w-full bg-background border border-border rounded p-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  <option value="equal to">Approximately equal to</option>
                  <option value="greater than">Greater than</option>
                  <option value="less than">Less than</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-muted mb-1.5 uppercase tracking-wide text-[10px]">
                  Claimed Value
                </label>
                <input
                  type="text"
                  value={claimedValue}
                  onChange={(e) => setClaimedValue(e.target.value)}
                  placeholder="e.g. 4.4"
                  required
                  className="w-full bg-background border border-border rounded p-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-[#F07824] hover:bg-[#D96414] text-white font-semibold rounded transition-colors text-xs mt-2 shadow-xs"
            >
              Evaluate Claim Against Public Data
            </button>
          </form>
        </div>

        {/* Results Output (7 cols) */}
        <div className="lg:col-span-7">
          {result && (
            <div className="bg-surface border border-border rounded-md overflow-hidden shadow-xs">
              {/* Verdict Header Banner */}
              {(() => {
                const style = getVerdictStyle(result.verdict);
                const IconComponent = style.icon;
                return (
                  <div className={`p-6 ${style.bg} border-b ${style.border}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <IconComponent className={`w-5 h-5 ${style.text}`} />
                      <span className={`text-xs font-bold uppercase tracking-wider ${style.text}`}>
                        VERDICT: {result.verdict.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground">
                      {style.title}
                    </h3>
                    <p className="text-xs md:text-sm text-foreground/85 mt-2 leading-relaxed">
                      {result.reasoning}
                    </p>
                  </div>
                );
              })()}

              {/* Parsed Claim vs Published Reality */}
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">
                    Evaluation Matrix
                  </h4>
                  <div className="border border-border rounded overflow-hidden text-xs">
                    <table className="w-full">
                      <tbody className="divide-y divide-border/60">
                        <tr className="bg-background/40">
                          <td className="py-2.5 px-4 font-semibold text-muted w-1/3">Target Area</td>
                          <td className="py-2.5 px-4 font-bold text-foreground">{result.parsedClaim.area}</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 font-semibold text-muted">Claimed Value</td>
                          <td className="py-2.5 px-4 font-data text-foreground">{String(result.parsedClaim.claimedValue)}</td>
                        </tr>
                        <tr className="bg-background/40">
                          <td className="py-2.5 px-4 font-semibold text-muted">Published Aggregate Values</td>
                          <td className="py-2.5 px-4 font-data text-accent font-bold">
                            {Object.keys(result.publishedValues).length > 0 ? (
                              Object.entries(result.publishedValues).map(([k, v]) => (
                                <span key={k}>{k}: {String(v)} </span>
                              ))
                            ) : (
                              <span className="text-muted">None available for this scope</span>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 font-semibold text-muted">Verification Method</td>
                          <td className="py-2.5 px-4 text-foreground/80">{result.method}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Sources & Citations */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-2">
                    Evidence Sources
                  </h4>
                  <ul className="list-disc list-inside text-xs text-muted space-y-1">
                    {result.sources.map((src, i) => (
                      <li key={i}>{src}</li>
                    ))}
                  </ul>
                </div>

                {/* Limitations */}
                <div className="p-4 bg-background border border-border/80 rounded text-xs space-y-1">
                  <p className="font-semibold text-foreground flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-muted" /> Caveats &amp; Limitations:
                  </p>
                  <ul className="list-disc list-inside text-muted space-y-0.5">
                    {result.limitations.map((lim, i) => (
                      <li key={i}>{lim}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
