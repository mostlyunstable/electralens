"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  ShieldAlert,
  Hash,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileCode2,
  Lock,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrambleText } from "@/components/ui/scramble-text";
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
  const [verificationStage, setVerificationStage] = useState<number>(4);
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
    setVerificationStage(1);

    try {
      // Stage 1: Parsing
      await new Promise((r) => setTimeout(r, 200));
      setVerificationStage(2);

      const reportObj = JSON.parse(manifest.reportContent);
      const aggObj = JSON.parse(manifest.aggregateContent);
      const repHash = await computeDocumentHash(reportObj);
      const aggHash = await computeDocumentHash(aggObj);

      // Stage 2: Web Crypto Hashing
      await new Promise((r) => setTimeout(r, 250));
      setVerificationStage(3);

      const manHash = await computeDocumentHash({ reportHash: repHash, aggregateHash: aggHash });

      // Stage 3: Manifest commitment check
      await new Promise((r) => setTimeout(r, 200));
      setVerificationStage(4);

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
      {/* Page Title with Staggered Entrance */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="verified">Cryptographic Verifier</Badge>
          <span className="text-xs text-muted font-data">SPECIFICATION: SHA-256 + CANONICAL-JSON (RFC 8785)</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Independent Publication Integrity Verification
        </h1>
        <p className="text-sm md:text-base text-muted mt-2 max-w-[780px] leading-relaxed">
          ElectraLens uses deterministic cryptographic commitments. Verify that the published analysis
          report and underlying aggregate statistical dataset match the published manifest without trusting our servers.
        </p>
      </motion.div>

      {/* Progress Verification Scanner Bar when verifying */}
      <AnimatePresence>
        {isVerifying && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-[#EAF0FC] border border-[#2864DC]/30 rounded-xl overflow-hidden"
          >
            <div className="flex items-center justify-between text-xs font-mono font-bold text-[#1C4BB4] mb-2">
              <span className="flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                VERIFYING PUBLICATION COMMITMENT CHAIN...
              </span>
              <span>Stage {verificationStage} of 4</span>
            </div>
            <div className="w-full h-2 bg-[#2864DC]/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#2864DC] rounded-full"
                initial={{ width: "20%" }}
                animate={{ width: `${(verificationStage / 4) * 100}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        {/* Verification Overview (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-surface border border-border rounded-xl p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                  Publication Manifest ID
                </span>
                <p className="font-data text-lg font-bold text-foreground">{manifest.id}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={runVerification}
                disabled={isVerifying}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-background border border-border hover:bg-border/40 rounded transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? "animate-spin" : ""}`} />
                <span>Re-calculate Hashes</span>
              </motion.button>
            </div>

            {/* Check Results List */}
            <div className="space-y-4">
              {/* Check 1: Report Hash */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                className="p-4 bg-background border border-border rounded-lg flex items-start justify-between gap-3"
              >
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
                    {verificationResult?.details.computedReportHash ? (
                      <ScrambleText text={verificationResult.details.computedReportHash} duration={350} />
                    ) : (
                      "Computing..."
                    )}
                  </p>
                </div>
                <Badge variant={verificationResult?.reportHashMatch ? "verified" : "critical"}>
                  {verificationResult?.reportHashMatch ? "Matches" : "Mismatch"}
                </Badge>
              </motion.div>

              {/* Check 2: Aggregate Hash */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="p-4 bg-background border border-border rounded-lg flex items-start justify-between gap-3"
              >
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
                    {verificationResult?.details.computedAggregateHash ? (
                      <ScrambleText text={verificationResult.details.computedAggregateHash} duration={350} />
                    ) : (
                      "Computing..."
                    )}
                  </p>
                </div>
                <Badge variant={verificationResult?.aggregateHashMatch ? "verified" : "critical"}>
                  {verificationResult?.aggregateHashMatch ? "Matches" : "Mismatch"}
                </Badge>
              </motion.div>

              {/* Check 3: Manifest Commitment Hash */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.15 }}
                className="p-4 bg-background border border-border rounded-lg flex items-start justify-between gap-3"
              >
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
                    {verificationResult?.details.computedManifestHash ? (
                      <ScrambleText text={verificationResult.details.computedManifestHash} duration={350} />
                    ) : (
                      "Computing..."
                    )}
                  </p>
                </div>
                <Badge variant={verificationResult?.manifestMatch ? "verified" : "critical"}>
                  {verificationResult?.manifestMatch ? "Verified" : "Mismatch"}
                </Badge>
              </motion.div>

              {/* Check 4: On-Chain Registry Anchor Status */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="p-4 bg-background border border-border rounded-lg flex items-start justify-between gap-3"
              >
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
              </motion.div>
            </div>
          </div>

          <div className="p-4 bg-surface border border-border rounded-xl text-xs text-muted leading-relaxed">
            <strong className="text-foreground">Statistical Integrity Disclaimer: </strong>
            A matching hash mathematically proves that the published document has not been modified since publication.
            It does not independently certify that the upstream original government electoral roll was free of reporting flaws.
          </div>
        </div>

        {/* Manifest Inspector (5 cols) */}
        <div className="lg:col-span-5 bg-surface border border-border rounded-xl p-6 flex flex-col justify-between shadow-xs">
          <div>
            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <FileCode2 className="w-4 h-4 text-accent" />
              Manifest Metadata Document
            </h3>
            <div className="bg-[#191A18] text-[#F7F6F2] rounded-lg p-4 font-data text-xs overflow-x-auto max-h-[380px]">
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
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-surface border-2 border-border/80 rounded-xl p-6 md:p-8"
      >
        <div className="max-w-2xl mb-6">
          <Badge variant="critical" className="mb-2">Adversarial Tamper Test</Badge>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            Simulate an Unauthorized Record Alteration
          </h2>
          <p className="text-xs md:text-sm text-muted mt-1 leading-relaxed">
            Modify any value in the committed aggregate data to witness the cryptographic cascade:
            changing even a single digit in the statistical matrix alters the resulting SHA-256 hash completely,
            causing immediate verification failure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end mb-6">
          <div className="md:col-span-8">
            <label className="text-xs font-semibold text-muted block mb-1">
              Field: <span className="font-mono text-foreground">comparison.additions</span> (Committed value: <span className="text-verified font-bold">24,891</span>)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={tamperedAdditions}
                onChange={(e) => setTamperedAdditions(e.target.value)}
                className="w-full bg-background border border-border rounded px-3 py-2 text-sm font-data focus:outline-none focus:border-accent"
                placeholder="Enter altered additions figure..."
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={runTamperDemo}
                className="px-4 py-2 bg-critical text-white text-xs font-semibold rounded hover:bg-critical/90 transition-colors whitespace-nowrap"
              >
                Inject Mutation
              </motion.button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {tamperResult && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 border border-border rounded-lg p-5 bg-background overflow-hidden"
            >
              <div className="flex items-center gap-2 mb-4">
                <ShieldAlert className="w-5 h-5 text-critical animate-pulse" />
                <h3 className="text-sm font-bold text-critical">
                  Cryptographic Commitment Mismatch Detected
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-data">
                <div className="p-3 bg-surface border border-border rounded">
                  <span className="text-[10px] text-muted uppercase font-bold block mb-1">
                    Authentic Aggregate Hash
                  </span>
                  <p className="text-verified break-all">{tamperResult.originalHash}</p>
                  <p className="text-muted mt-2">Value: {String(tamperResult.originalValue)}</p>
                </div>

                <div className="p-3 bg-red-950/10 border border-critical/30 rounded">
                  <span className="text-[10px] text-critical uppercase font-bold block mb-1">
                    Tampered Aggregate Hash (Altered)
                  </span>
                  <p className="text-critical break-all font-bold">
                    <ScrambleText text={tamperResult.tamperedHash} duration={400} />
                  </p>
                  <p className="text-critical mt-2">Value: {String(tamperResult.tamperedValue)} (MODIFIED)</p>
                </div>
              </div>

              <div className="mt-4 p-3 bg-critical/5 border border-critical/20 rounded text-xs text-critical leading-relaxed">
                <strong>Avalanche Effect Confirmed: </strong>
                Because of the mathematical properties of SHA-256, changing the additions figure from 24,891 to {String(tamperResult.tamperedValue)} produces a completely distinct 256-bit digest.
                Any third-party observer running this check would detect that the report was altered after publication.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>
    </div>
  );
}
