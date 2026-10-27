import Link from "next/link";
import {
  ShieldAlert,
  Scale,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Users,
  Compass,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AboutPage() {
  return (
    <div className="max-w-[960px] mx-auto px-4 md:px-8 py-10 md:py-16">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="default">Civic Mission</Badge>
          <span className="text-xs text-muted font-data">ABOUT ELECTRALENS</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">
          Independent Civic Intelligence for Democratic Accountability
        </h1>
        <p className="text-base md:text-lg text-muted mt-3 leading-relaxed">
          ElectraLens is a public-interest research tool designed to illuminate changes between published electoral-roll versions,
          evaluate statistical outliers, and provide verifiable proof of public dataset integrity.
        </p>
      </div>

      {/* Prominent Independence Notice */}
      <div className="p-6 bg-surface border-2 border-accent/30 rounded-md mb-10 space-y-3 shadow-xs">
        <div className="flex items-center gap-2 text-accent font-bold text-sm uppercase tracking-wider">
          <ShieldAlert className="w-5 h-5" />
          <span>Statement of Non-Affiliation</span>
        </div>
        <p className="text-sm md:text-base font-semibold text-foreground leading-relaxed">
          ElectraLens is an independent civic-tech project. It is not affiliated with, authorized by, sponsored by, or endorsed by the Election Commission of India (ECI) or any state Chief Electoral Officer.
        </p>
        <p className="text-xs text-muted leading-relaxed">
          ElectraLens does not conduct voter registration, process official election complaints, or replace statutory revision processes. For official voter registrations and administrative updates, consult the official portal at <a href="https://eci.gov.in" target="_blank" rel="noopener noreferrer" className="text-accent underline">eci.gov.in</a>.
        </p>
      </div>

      {/* Mission & Purpose */}
      <div className="space-y-8 text-xs md:text-sm text-foreground/85 leading-relaxed">
        <section className="bg-surface border border-border rounded-md p-6 space-y-3">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Compass className="w-4 h-4 text-accent" />
            Why ElectraLens Exists
          </h2>
          <p>
            Electoral rolls represent the bedrock of representative democracy. In large democracies, hundreds of thousands of additions, deletions, and corrections occur during every revision cycle.
            Journalists and civic groups often lack the statistical infrastructure required to differentiate normal demographic changes from unusual anomalies.
          </p>
          <p>
            ElectraLens bridges this gap by offering:
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted pl-2">
            <li><strong>Reproducible differential comparison:</strong> Ingest two versions of a roll and see exact additions, deletions, and shifts.</li>
            <li><strong>Pre-registered statistical tests:</strong> Mathematical rules that control for multiple-testing false discovery rates.</li>
            <li><strong>Contextual humility:</strong> Mandatory presentation of alternative, non-malicious hypotheses for every flagged anomaly.</li>
            <li><strong>Cryptographic verifiability:</strong> SHA-256 commitments so public reports can be independently checked for tampering.</li>
          </ul>
        </section>

        {/* The Principle of Statistical Humility */}
        <section className="bg-surface border border-border rounded-md p-6 space-y-3">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Scale className="w-4 h-4 text-verified" />
            The Principle of Statistical Humility
          </h2>
          <p>
            An anomaly is not proof of misconduct. Rapid growth in new voters may stem from college enrollments, residential handovers, or targeted registration drives.
            Unusually high deletion rates may reflect delayed updates following public health records or routine deduplication.
          </p>
          <p>
            ElectraLens strictly prohibits sensationalism. The platform never declares an area "rigged" or "fraudulent." It presents public facts, mathematical models, and uncertainties so observers can conduct rigorous, ground-truth inquiries.
          </p>
        </section>

        {/* Hackathon Scope & Roadmap */}
        <section className="bg-surface border border-border rounded-md p-6 space-y-3">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-muted" />
            Hackathon Scope &amp; Open Architecture
          </h2>
          <p>
            During this hackathon release, all roll data and polling stations shown are deterministic synthetic demonstration fixtures designed to validate user workflows, charting components, and cryptographic verifiers.
            The complete codebase is designed for modular integration with official open datasets and public research pipelines.
          </p>
        </section>
      </div>
    </div>
  );
}
