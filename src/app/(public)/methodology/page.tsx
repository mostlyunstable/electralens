"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Scale,
  BookOpen,
  FileCode2,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  ArrowRight,
  Database,
  Hash,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { statisticalRules } from "@/lib/data";

export default function MethodologyPage() {
  const [expandedRule, setExpandedRule] = useState<string | null>("RULE-ADD-01");

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-10 md:py-16">
      {/* Page Title */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="default">Documentation</Badge>
          <span className="text-xs text-muted font-data">METHODOLOGY SPECIFICATION v1.0.0</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">
          Public Methodology &amp; Statistical Framework
        </h1>
        <p className="text-base md:text-lg text-muted mt-3 max-w-[800px] leading-relaxed">
          ElectraLens is committed to radical analytical transparency. This document details the mathematical models,
          canonicalization standards, false discovery controls, and known limitations governing all published roll analytics.
        </p>
      </div>

      {/* Nav Anchor Links */}
      <div className="flex flex-wrap gap-2 p-3 bg-surface border border-border rounded-md mb-12 text-xs font-medium">
        <a href="#canonicalization" className="px-3 py-1 bg-background hover:bg-border/60 rounded text-foreground transition-colors">
          1. Schema &amp; Canonicalization
        </a>
        <a href="#comparison" className="px-3 py-1 bg-background hover:bg-border/60 rounded text-foreground transition-colors">
          2. Differential Comparison Rules
        </a>
        <a href="#fdr" className="px-3 py-1 bg-background hover:bg-border/60 rounded text-foreground transition-colors">
          3. Multiple-Testing Correction
        </a>
        <a href="#rules-table" className="px-3 py-1 bg-background hover:bg-border/60 rounded text-foreground transition-colors">
          4. Registered Detection Rules
        </a>
        <a href="#limitations" className="px-3 py-1 bg-background hover:bg-border/60 rounded text-foreground transition-colors">
          5. Uncertainty &amp; Limitations
        </a>
      </div>

      <div className="space-y-16">
        {/* SECTION 1: Schema & Canonicalization */}
        <section id="canonicalization" className="scroll-mt-20">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-data text-xs text-accent font-bold">SECTION 01</span>
            <span className="text-xs text-muted uppercase tracking-wider font-semibold">Data Engineering</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Dataset Schema &amp; Deterministic Canonicalization
          </h2>
          <p className="text-sm md:text-base text-muted leading-relaxed mb-6">
            Electoral registers from disparate sources frequently arrive in heterogeneous encodings, unsorted records, and differing whitespace styles.
            To guarantee that hashes are reproducible on any operating system, ElectraLens enforces a strict canonicalization standard.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface border border-border rounded-md p-6">
              <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-accent" /> Canonicalization Rules
              </h3>
              <ul className="space-y-2 text-xs text-muted leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-foreground font-semibold">1. Key Sorting:</span> All dictionary and JSON object keys are strictly sorted in lexicographical ASCII order prior to serialization.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-foreground font-semibold">2. Whitespace Elimination:</span> All extraneous line breaks, tabs, and spaces outside quotation delimiters are stripped.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-foreground font-semibold">3. UTF-8 NFC Normalization:</span> Text values are normalized using Unicode Standard Annex #15 (NFC) to ensure consistent composite characters.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-foreground font-semibold">4. Identity Scrubbing:</span> Voter names, addresses, and ID numbers are removed or salt-hashed prior to generating public aggregate records.
                </li>
              </ul>
            </div>

            <div className="bg-[#191A18] text-[#F7F6F2] border border-border rounded-md p-5 font-data text-xs overflow-x-auto">
              <p className="text-white/40 text-[10px] uppercase mb-2">Canonicalization Algorithm Representation</p>
              <pre className="text-white/80 leading-relaxed font-mono">
{`function canonicalise(obj) {
  if (Array.isArray(obj)) {
    return "[" + obj.map(canonicalise).join(",") + "]";
  }
  if (typeof obj === "object" && obj !== null) {
    const keys = Object.keys(obj).sort();
    return "{" + keys.map(k => 
      JSON.stringify(k) + ":" + canonicalise(obj[k])
    ).join(",") + "}";
  }
  return JSON.stringify(obj);
}`}
              </pre>
            </div>
          </div>
        </section>

        {/* SECTION 2: Differential Comparison Rules */}
        <section id="comparison" className="scroll-mt-20">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-data text-xs text-accent font-bold">SECTION 02</span>
            <span className="text-xs text-muted uppercase tracking-wider font-semibold">Differential Auditing</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Version Comparison &amp; Change Classification
          </h2>
          <p className="text-sm md:text-base text-muted leading-relaxed mb-6">
            When comparing baseline roll revision <code className="font-data text-xs bg-surface px-1.5 py-0.5 rounded border border-border">T₀</code> and target roll revision <code className="font-data text-xs bg-surface px-1.5 py-0.5 rounded border border-border">T₁</code>, each record is partitioned into exactly one of four mutually exclusive sets:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-surface border border-border rounded-md p-5">
              <p className="text-xs font-bold text-verified uppercase tracking-wider mb-1">Additions (A)</p>
              <p className="text-xs text-muted leading-relaxed">
                Records present in T₁ whose unique voter identifier did not exist in T₀. Calculated as new registrations.
              </p>
            </div>
            <div className="bg-surface border border-border rounded-md p-5">
              <p className="text-xs font-bold text-critical uppercase tracking-wider mb-1">Deletions (D)</p>
              <p className="text-xs text-muted leading-relaxed">
                Records present in T₀ that do not appear in T₁. Includes deceased removals, interstate migrations, and administrative de-duplication.
              </p>
            </div>
            <div className="bg-surface border border-border rounded-md p-5">
              <p className="text-xs font-bold text-caution uppercase tracking-wider mb-1">Corrections (C)</p>
              <p className="text-xs text-muted leading-relaxed">
                Records present in both T₀ and T₁ under identical identifiers where demographic, address, or polling-station attributes were modified.
              </p>
            </div>
            <div className="bg-surface border border-border rounded-md p-5">
              <p className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">Unchanged (U)</p>
              <p className="text-xs text-muted leading-relaxed">
                Records with identical cryptographic hashes across both T₀ and T₁.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3: Multiple Testing & FDR */}
        <section id="fdr" className="scroll-mt-20">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-data text-xs text-accent font-bold">SECTION 03</span>
            <span className="text-xs text-muted uppercase tracking-wider font-semibold">Statistical Discipline</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Multiple-Testing Correction &amp; False Discovery Rate (FDR)
          </h2>
          <div className="bg-surface border border-border rounded-md p-6 space-y-4">
            <p className="text-sm text-foreground/85 leading-relaxed">
              When screening thousands of polling stations or hundreds of assembly constituencies simultaneously, standard unadjusted significance thresholds (such as <em>p &lt; 0.05</em>) will inevitably produce dozens of false positives simply by random chance.
            </p>
            <p className="text-sm text-foreground/85 leading-relaxed">
              ElectraLens enforces the <strong>Benjamini-Hochberg procedure</strong> across all simultaneous hypothesis tests to control the False Discovery Rate (FDR). An anomaly is only published when its adjusted <em>q-value</em> meets our pre-registered thresholds:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="border border-border rounded p-4 bg-background">
                <span className="text-xs font-bold text-critical uppercase tracking-wider">Strong Signal</span>
                <p className="font-data text-sm font-bold text-foreground mt-1">q &lt; 0.01</p>
                <p className="text-xs text-muted mt-1">Less than 1% expected false discovery rate. Significant deviation from baseline.</p>
              </div>

              <div className="border border-border rounded p-4 bg-background">
                <span className="text-xs font-bold text-caution uppercase tracking-wider">Moderate Signal</span>
                <p className="font-data text-sm font-bold text-foreground mt-1">0.01 &le; q &lt; 0.05</p>
                <p className="text-xs text-muted mt-1">Substantial deviation requiring context review. Flagged for analyst inspection.</p>
              </div>

              <div className="border border-border rounded p-4 bg-background">
                <span className="text-xs font-bold text-muted uppercase tracking-wider">Weak / Non-Significant</span>
                <p className="font-data text-sm font-bold text-foreground mt-1">q &ge; 0.05</p>
                <p className="text-xs text-muted mt-1">Fails multiple-testing significance test. Withheld from primary published findings.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: Registered Rules Table */}
        <section id="rules-table" className="scroll-mt-20">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-data text-xs text-accent font-bold">SECTION 04</span>
            <span className="text-xs text-muted uppercase tracking-wider font-semibold">Catalog</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Published Detection Rules Specification
          </h2>
          <p className="text-sm text-muted mb-6 leading-relaxed">
            All rule parameters are deterministic and publicly auditable. Expand any rule to inspect its formal test formulation, thresholds, and known limitations.
          </p>

          <div className="space-y-4">
            {statisticalRules.map((rule) => {
              const isExpanded = expandedRule === rule.id;
              return (
                <div key={rule.id} className="bg-surface border border-border rounded-md overflow-hidden">
                  <div
                    onClick={() => setExpandedRule(isExpanded ? null : rule.id)}
                    className="p-5 flex items-center justify-between cursor-pointer hover:bg-background/50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <span className="font-data text-xs font-bold text-accent bg-accent/10 px-2.5 py-1 rounded">
                        {rule.id}
                      </span>
                      <div>
                        <h3 className="text-base font-bold text-foreground">{rule.name}</h3>
                        <p className="text-xs text-muted">{rule.category} · v{rule.version}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-data text-muted hidden md:inline-block">
                        Benchmark: {rule.benchmarkPrecision}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-muted" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted" />
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-2 border-t border-border/70 bg-background/30 text-xs space-y-4">
                      <p className="text-sm text-foreground/80 leading-relaxed">{rule.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-surface border border-border/80 rounded p-3 space-y-2">
                          <p className="font-semibold text-foreground uppercase tracking-wider text-[10px]">
                            Detection Model &amp; Threshold
                          </p>
                          <p><strong className="text-muted">Test:</strong> {rule.statisticalTest}</p>
                          <p><strong className="text-muted">Criterion:</strong> <span className="font-data">{rule.detectionCriterion}</span></p>
                          <p><strong className="text-muted">Nominal Threshold:</strong> {rule.threshold}</p>
                        </div>

                        <div className="bg-surface border border-border/80 rounded p-3 space-y-1.5">
                          <p className="font-semibold text-caution uppercase tracking-wider text-[10px] flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" /> Methodological Limitations
                          </p>
                          <ul className="list-disc list-inside text-muted space-y-1">
                            {rule.limitations.map((lim, idx) => (
                              <li key={idx}>{lim}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 5: Limitations & Scientific Uncertainty */}
        <section id="limitations" className="scroll-mt-20">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-data text-xs text-accent font-bold">SECTION 05</span>
            <span className="text-xs text-muted uppercase tracking-wider font-semibold">Civic Integrity</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Uncertainty, Nuance &amp; Non-Misconduct Standards
          </h2>
          <div className="bg-surface border border-border rounded-md p-6 space-y-4 text-sm text-foreground/80 leading-relaxed">
            <p>
              Statistical analysis reveals divergence from expectations; it cannot discern human motivation.
              In civic data science, false accusations damage public confidence as severely as undetected irregularities.
            </p>
            <div className="p-4 bg-caution/10 border border-caution/20 rounded text-xs text-caution leading-relaxed">
              <strong>Mandatory Reporting Guideline:</strong> ElectraLens findings must never be characterized as "proof of illegal voters" or "electoral manipulation." They represent aggregate statistical signals requiring field investigation by accredited journalists and independent observers.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
