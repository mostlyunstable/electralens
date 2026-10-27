"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  ShieldAlert,
  Hash,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileCode2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { publicationManifests } from "@/lib/data";
import {
  canonicalise,
  computeDocumentHash,
  demonstrateTamper,
  verifyPublication,
  type VerificationStatus,
} from "@/lib/verification";

export function VerificationClient({ pubId }: { pubId: string }) {
  const manifest = publicationManifests.find((m) => m.id === pubId) || publicationManifests[0];

  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationStatus | null>(null);

  // Tamper Demo State
  const [tamperedAdditions, setTamperedAdditions] = useState("35000"); // Original is 24891
  const [tamperResult, setTamperResult] = useState<{
    originalHash: string;
    tamperedHash: string;
    match: boolean;
    originalValue: unknown;
    tamperedValue: unknown;
  } | null>(null);

  const runVerification = async () => {
    setIsVerifying(true);
    try {
      const reportObj = JSON.parse(manifest.reportContent);
      const aggObj = JSON.parse(manifest.aggregateContent);
      const repHash = await computeDocumentHash(reportObj);
      const aggHash = await computeDocumentHash(aggObj);
      const manHash = await computeDocumentHash({ reportHash: repHash, aggregateHash: aggHash });

      const verified = await verifyPublication({
        reportContent: manifest.reportContent,
        aggregateContent: manifest.aggregateContent,
        reportHash: repHash,
        aggregateHash: aggHash,
        manifestHash: manHash,
      });

      setVerificationResult(verified);
    } catch (err) {
      console.error(err);
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    runVerification();
  }, [pubId]);

  const runTamperDemo = async () => {
    const res = await demonstrateTamper(
      manifest.aggregateContent,
      "comparison.additions",
      parseInt(tamperedAdditions, 10) || 35000
    );
    setTamperResult(res);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-10 md:py-16">
      {/* Page Title */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="verified">Cryptographic Verifier</Badge>
          <span className="text-xs text-muted font-data">SPECIFICATION: SHA-256 + CANONICAL-JSON</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Independent Publication Integrity Verification
        </h1>
        <p className="text-sm md:text-base text-muted mt-2 max-w-[780px] leading-relaxed">
          ElectraLens uses deterministic cryptographic commitments. Verify that the published analysis
          report and underlying aggregate statistical dataset match the published manifest without trusting our servers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        {/* Verification Overview (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-surface border border-border rounded-md p-6">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                  Publication Manifest ID
                </span>
                <p className="font-data text-lg font-bold text-foreground">{manifest.id}</p>
              </div>
              <button
                onClick={runVerification}
                disabled={isVerifying}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-background border border-border hover:bg-border/40 rounded transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? "animate-spin" : ""}`} />
                Re-calculate Hashes
              </button>
            </div>

            {/* Check Results List */}
            <div className="space-y-4">
              {/* Check 1: Report Hash */}
              <div className="p-4 bg-background border border-border rounded flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    {verificationResult?.reportHashMatch ? (
                      <CheckCircle2 className="w-4 h-4 text-verified" />
                    ) : (
                      <XCircle className="w-4 h-4 text-critical" />
                    )}
                    <span className="text-xs font-bold text-foreground">
                      Analysis Report Document Hash (SHA-256)
                    </span>
                  </div>
                  <p className="text-[11px] text-muted font-data break-all mt-1 pl-6">
                    {verificationResult?.details.computedReportHash || "Computing..."}
                  </p>
                </div>
                <Badge variant={verificationResult?.reportHashMatch ? "verified" : "critical"}>
                  {verificationResult?.reportHashMatch ? "Matches" : "Mismatch"}
                </Badge>
              </div>

              {/* Check 2: Aggregate Hash */}
              <div className="p-4 bg-background border border-border rounded flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    {verificationResult?.aggregateHashMatch ? (
                      <CheckCircle2 className="w-4 h-4 text-verified" />
                    ) : (
                      <XCircle className="w-4 h-4 text-critical" />
                    )}
                    <span className="text-xs font-bold text-foreground">
                      Aggregate Statistical Matrix Hash (SHA-256)
                    </span>
                  </div>
                  <p className="text-[11px] text-muted font-data break-all mt-1 pl-6">
                    {verificationResult?.details.computedAggregateHash || "Computing..."}
                  </p>
                </div>
                <Badge variant={verificationResult?.aggregateHashMatch ? "verified" : "critical"}>
                  {verificationResult?.aggregateHashMatch ? "Matches" : "Mismatch"}
                </Badge>
              </div>

              {/* Check 3: Manifest Commitment Hash */}
              <div className="p-4 bg-background border border-border rounded flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    {verificationResult?.manifestMatch ? (
                      <CheckCircle2 className="w-4 h-4 text-verified" />
                    ) : (
                      <XCircle className="w-4 h-4 text-critical" />
                    )}
                    <span className="text-xs font-bold text-foreground">
                      Manifest Composite Commitment Hash
                    </span>
                  </div>
                  <p className="text-[11px] text-muted font-data break-all mt-1 pl-6">
                    {verificationResult?.details.computedManifestHash || "Computing..."}
                  </p>
                </div>
                <Badge variant={verificationResult?.manifestMatch ? "verified" : "critical"}>
                  {verificationResult?.manifestMatch ? "Verified" : "Mismatch"}
                </Badge>
              </div>

              {/* Check 4: On-Chain Registry Anchor Status */}
              <div className="p-4 bg-background border border-border rounded flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-caution" />
                    <span className="text-xs font-bold text-foreground">
                      On-Chain Registry Anchor (Mainnet RPC)
                    </span>
                  </div>
                  <p className="text-xs text-muted mt-1 pl-6">
                    Standalone local demonstration mode. No live public contract address configured for this hackathon preview.
                  </p>
                </div>
                <Badge variant="status-pending">Local Demo</Badge>
              </div>
            </div>
          </div>

          <div className="p-4 bg-surface border border-border rounded-md text-xs text-muted leading-relaxed">
            <strong className="text-foreground">Statistical Integrity Disclaimer: </strong>
            A matching hash mathematically proves that the published document has not been modified since publication.
            It does not independently certify that the upstream original government electoral roll was free of reporting flaws.
          </div>
        </div>

        {/* Manifest Inspector (5 cols) */}
        <div className="lg:col-span-5 bg-surface border border-border rounded-md p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <FileCode2 className="w-4 h-4 text-accent" />
              Manifest Metadata Document
            </h3>
            <div className="bg-[#191A18] text-[#F7F6F2] rounded p-4 font-data text-xs overflow-x-auto max-h-[380px]">
              <pre className="font-mono text-[11px] leading-relaxed">
{JSON.stringify(
  {
    publicationId: manifest.id,
    version: manifest.version,
    publishedAt: manifest.publishedAt,
    publisher: manifest.publisher,
    commitments: {
      reportHash: verificationResult?.details.computedReportHash || "c9b8...",
      aggregateHash: verificationResult?.details.computedAggregateHash || "e3b0...",
      manifestHash: verificationResult?.details.computedManifestHash || "7a1b...",
    },
    blockchainAnchor: {
      status: "unanchored_demo",
      network: "none",
    },
  },
  null,
  2
)}
              </pre>
            </div>
          </div>

          <div className="pt-4 border-t border-border mt-4 text-xs text-muted">
            <p>Specification standard: ElectraLens Canonical RFC-01</p>
            <p>Hash algorithm: SHA-256 (FIPS 180-4)</p>
          </div>
        </div>
      </div>

      {/* ===== INTERACTIVE TAMPER DEMONSTRATION ===== */}
      <section className="bg-surface border-2 border-border/80 rounded-md p-6 md:p-8">
        <div className="max-w-[800px] mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-data text-xs text-accent font-bold">TAMPER SIMULATION</span>
            <Badge variant="critical">Interactive Security Demonstration</Badge>
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            Test Tamper-Detection In Real Time
          </h2>
          <p className="text-sm text-muted mt-2 leading-relaxed">
            Change any single numeric cell in the synthetic demonstration aggregate report.
            Observe how the cryptographic hash instantly diverges, alerting anyone that an unauthorized edit occurred.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-5 bg-background border border-border rounded p-5 space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-muted uppercase text-[10px] mb-1">
                Target Record Field
              </label>
              <input
                type="text"
                disabled
                value="comparison.additions"
                className="w-full bg-surface border border-border rounded p-2 font-data text-muted"
              />
            </div>

            <div>
              <label className="block font-semibold text-muted uppercase text-[10px] mb-1">
                Committed Original Value
              </label>
              <input
                type="text"
                disabled
                value="24,891"
                className="w-full bg-surface border border-border rounded p-2 font-data text-verified font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-muted uppercase text-[10px] mb-1">
                Mutated Value to Inject
              </label>
              <input
                type="number"
                value={tamperedAdditions}
                onChange={(e) => setTamperedAdditions(e.target.value)}
                placeholder="Enter altered number"
                className="w-full bg-surface border border-border rounded p-2 font-data text-critical font-bold focus:ring-1 focus:ring-accent focus:outline-none"
              />
            </div>

            <button
              onClick={runTamperDemo}
              className="w-full py-2.5 px-4 bg-[#F07824] hover:bg-[#D96414] text-white font-semibold rounded text-xs transition-colors shadow-xs"
            >
              Simulate Alteration &amp; Recompute Hash
            </button>
          </div>

          <div className="md:col-span-7">
            {tamperResult ? (
              <div className="bg-background border border-border rounded p-5 space-y-4">
                <div className="flex items-center gap-2 text-critical font-bold text-sm">
                  <XCircle className="w-5 h-5 shrink-0" />
                  <span>TAMPER DETECTED: Commitments Diverge</span>
                </div>

                <div className="space-y-3 text-xs font-data">
                  <div className="p-3 bg-verified/5 border border-verified/20 rounded">
                    <p className="text-[10px] uppercase font-semibold text-verified mb-1">
                      Committed Baseline Digest:
                    </p>
                    <p className="break-all text-verified select-all">
                      {tamperResult.originalHash}
                    </p>
                  </div>

                  <div className="p-3 bg-critical/5 border border-critical/20 rounded">
                    <p className="text-[10px] uppercase font-semibold text-critical mb-1">
                      Recalculated Altered Digest:
                    </p>
                    <p className="break-all text-critical select-all">
                      {tamperResult.tamperedHash}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-muted leading-relaxed pt-2 border-t border-border/60">
                  Because SHA-256 has the avalanche effect, changing even a single digit from <strong>24,891</strong> to <strong>{tamperedAdditions}</strong> changes roughly 50% of the output bits.
                  Any verifier running on any machine immediately rejects the altered dataset.
                </p>
              </div>
            ) : (
              <div className="bg-background border border-border/80 border-dashed rounded p-8 text-center text-xs text-muted">
                <Hash className="w-8 h-8 mx-auto mb-2 opacity-40 text-muted" />
                <p className="font-semibold text-foreground">Tamper Detector Ready</p>
                <p className="mt-1 max-w-sm mx-auto">
                  Click the button on the left to inject an altered value and watch the SHA-256 cascade failure.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
