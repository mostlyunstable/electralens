import Link from "next/link";
import {
  Database,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Layers,
  FileCode2,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { datasetVersions, publicationManifests } from "@/lib/data";
import { formatNumber, formatDate } from "@/lib/utils";

export default function SourcesPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-10 md:py-16">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="default">Provenance</Badge>
          <span className="text-xs text-muted font-data">PROVENANCE &amp; HISTORY</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Dataset Provenance &amp; Ingestion History
        </h1>
        <p className="text-sm md:text-base text-muted mt-2 max-w-[760px] leading-relaxed">
          ElectraLens maintains a cryptographic registry of every electoral roll release ingested,
          standardized, and audited. Trace dataset versions, SHA-256 signatures, and publication manifests.
        </p>
      </div>

      {/* Synthetic Notice */}
      <div className="p-4 bg-caution/10 border border-caution/20 rounded-md mb-8 flex items-start gap-3 text-xs text-caution leading-relaxed">
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">Hackathon Demonstration Notice: </strong>
          The datasets listed below are deterministic synthetic fixtures engineered to test differential analysis algorithms,
          outlier detection models, and cryptographic verifiers. No personal data from living citizens is processed.
        </div>
      </div>

      {/* Dataset Version Table */}
      <div className="bg-surface border border-border rounded-md p-6 mb-10">
        <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
          <Database className="w-4 h-4 text-accent" />
          Ingested Electoral Roll Releases
        </h2>

        <div className="border border-border rounded overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-background border-b border-border text-muted uppercase text-[10px] font-semibold">
                <th className="py-3 px-4 text-left">Version ID</th>
                <th className="py-3 px-4 text-left">Snapshot Label</th>
                <th className="py-3 px-4 text-left">Publication Date</th>
                <th className="py-3 px-4 text-right">Electorate Count</th>
                <th className="py-3 px-4 text-left">SHA-256 Digest</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {datasetVersions.map((v) => (
                <tr key={v.id} className="hover:bg-background/40 transition-colors">
                  <td className="py-3 px-4 font-data font-bold text-foreground">{v.id}</td>
                  <td className="py-3 px-4 font-medium text-foreground">{v.label}</td>
                  <td className="py-3 px-4 text-muted">{formatDate(v.date)}</td>
                  <td className="py-3 px-4 text-right font-data font-semibold text-foreground">
                    {formatNumber(v.totalRecords)}
                  </td>
                  <td className="py-3 px-4 font-data text-muted text-[11px] max-w-[200px] truncate" title={v.hash}>
                    {v.hash.substring(0, 16)}...{v.hash.substring(v.hash.length - 8)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Publication Manifests Register */}
      <div className="bg-surface border border-border rounded-md p-6 mb-10">
        <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-verified" />
          Public Aggregate Publication Manifests
        </h2>

        <div className="space-y-4">
          {publicationManifests.map((manifest) => (
            <div
              key={manifest.id}
              className="p-5 border border-border rounded bg-background/50 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-data font-bold text-foreground">{manifest.id}</span>
                  <Badge variant="status-published">Revision {manifest.version}</Badge>
                  <span className="text-muted">• {manifest.publisher}</span>
                </div>
                <p className="text-muted">
                  Committed at {new Date(manifest.publishedAt).toLocaleString()}
                </p>
              </div>

              <Link
                href={`/verify/${manifest.id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-foreground text-surface rounded text-xs font-semibold hover:bg-foreground/90 transition-colors shrink-0"
              >
                Inspect &amp; Verify Manifest <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* External Official Portals */}
      <div className="bg-surface border border-border rounded-md p-6">
        <h2 className="text-base font-bold text-foreground mb-3">
          Official Government Electoral Portals
        </h2>
        <p className="text-xs text-muted mb-4 leading-relaxed">
          ElectraLens operates independently and does not replace official electoral services.
          Consult the official portals below for official notices, voter registration (Form 6), and electoral roll downloads.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a
            href="https://eci.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 border border-border rounded hover:border-foreground/40 transition-colors block text-xs"
          >
            <div className="flex items-center justify-between font-bold text-foreground mb-1">
              <span>Election Commission of India (ECI)</span>
              <ExternalLink className="w-3.5 h-3.5 text-muted" />
            </div>
            <p className="text-muted text-[11px]">eci.gov.in — National electoral management body</p>
          </a>

          <a
            href="https://voters.eci.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 border border-border rounded hover:border-foreground/40 transition-colors block text-xs"
          >
            <div className="flex items-center justify-between font-bold text-foreground mb-1">
              <span>National Voters' Services Portal (NVSP)</span>
              <ExternalLink className="w-3.5 h-3.5 text-muted" />
            </div>
            <p className="text-muted text-[11px]">voters.eci.gov.in — Citizen voter services, registration, and forms</p>
          </a>
        </div>
      </div>
    </div>
  );
}
