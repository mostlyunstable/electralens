"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  TrendingUp,
  TrendingDown,
  FileCheck,
  Search,
  Filter,
  Download,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Layers,
  ArrowUpDown,
  Info,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import {
  datasetVersions,
  primaryComparison,
  areaBreakdowns,
  findings,
  type AreaBreakdown,
} from "@/lib/data";
import { formatNumber, formatDate } from "@/lib/utils";

export default function ComparePage() {
  const [baselineId, setBaselineId] = useState(primaryComparison.baselineId);
  const [targetId, setTargetId] = useState(primaryComparison.targetId);
  const [searchTerm, setSearchTerm] = useState("");
  const [geoFilter, setGeoFilter] = useState<"all" | "Assembly" | "Ward" | "Block">("all");
  const [sortField, setSortField] = useState<keyof AreaBreakdown>("additionRate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Selection validation
  const isValidSelection = baselineId !== targetId;
  const isDefaultPair =
    baselineId === primaryComparison.baselineId && targetId === primaryComparison.targetId;

  // Filter & sort table data
  const filteredAreas = useMemo(() => {
    return areaBreakdowns
      .filter((area) => {
        const matchesSearch =
          area.areaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          area.areaCode.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGeo =
          geoFilter === "all" || area.areaName.includes(geoFilter);
        return matchesSearch && matchesGeo;
      })
      .sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortDirection === "desc" ? bVal - aVal : aVal - bVal;
        }
        return sortDirection === "desc"
          ? String(bVal).localeCompare(String(aVal))
          : String(aVal).localeCompare(String(bVal));
      });
  }, [searchTerm, geoFilter, sortField, sortDirection]);

  // Associated findings
  const comparisonFindings = useMemo(() => {
    return findings.filter(
      (f) => f.baselineVersion === baselineId && f.targetVersion === targetId
    );
  }, [baselineId, targetId]);

  // Export functions
  const handleExportCSV = () => {
    const headers = ["Area Code", "Area Name", "Total Records", "Additions", "Addition Rate %", "Deletions", "Deletion Rate %", "Corrections"];
    const rows = filteredAreas.map((a) => [
      a.areaCode,
      `"${a.areaName}"`,
      a.totalRecords,
      a.additions,
      a.additionRate,
      a.deletions,
      a.deletionRate,
      a.corrections,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `electralens-comparison-${baselineId}-to-${targetId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    const exportData = {
      baseline: baselineId,
      target: targetId,
      exportedAt: new Date().toISOString(),
      summary: primaryComparison,
      data: filteredAreas,
    };
    const jsonContent = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", jsonContent);
    link.setAttribute("download", `electralens-comparison-${baselineId}-to-${targetId}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSort = (field: keyof AreaBreakdown) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "desc" ? "asc" : "desc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-10 md:py-16">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="synthetic">Synthetic Demonstration Fixture</Badge>
          <span className="text-xs text-muted font-data">WORKSPACE: ROLL-COMPARE</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Dataset Version Comparison
        </h1>
        <p className="text-sm md:text-base text-muted mt-2 max-w-[720px] leading-relaxed">
          Examine aggregate additions, deletions, and corrections across two snapshots of the electoral roll.
          Filter by administrative hierarchy and inspect statistical divergence.
        </p>
      </div>

      {/* Dataset Selection Controls */}
      <div className="bg-surface border border-border rounded-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end">
          <div className="lg:col-span-2">
            <label className="block text-xs font-semibold tracking-wide uppercase text-muted mb-2">
              Baseline Dataset (T₀)
            </label>
            <select
              value={baselineId}
              onChange={(e) => setBaselineId(e.target.value)}
              className="w-full bg-background border border-border rounded p-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {datasetVersions.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label} ({formatDate(v.date)})
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-2">
            <label className="block text-xs font-semibold tracking-wide uppercase text-muted mb-2">
              Target Dataset (T₁)
            </label>
            <select
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              className="w-full bg-background border border-border rounded p-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {datasetVersions.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label} ({formatDate(v.date)})
                </option>
              ))}
            </select>
          </div>

          <div>
            <button
              onClick={() => {
                setBaselineId(primaryComparison.baselineId);
                setTargetId(primaryComparison.targetId);
              }}
              className="w-full py-2.5 px-4 text-xs font-medium border border-border hover:bg-background rounded transition-colors text-muted hover:text-foreground"
            >
              Reset to Primary Pair
            </button>
          </div>
        </div>

        {!isValidSelection && (
          <div className="mt-4 p-3 bg-critical/10 border border-critical/20 rounded flex items-center gap-2 text-critical text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Invalid selection: Baseline and Target datasets cannot be identical. Please select distinct roll revisions.</span>
          </div>
        )}

        {isValidSelection && !isDefaultPair && (
          <div className="mt-4 p-3 bg-caution/10 border border-caution/20 rounded flex items-center gap-2 text-caution text-xs">
            <Info className="w-4 h-4 shrink-0" />
            <span>Note: Full record-level differential matrix is pre-computed for Q1 Draft → Q2 Final. Selected alternative pair displays extrapolated statistical aggregates.</span>
          </div>
        )}
      </div>

      {isValidSelection && (
        <>
          {/* Comparison Stat Cards with Hover Lift & Animated Counters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <motion.div
              whileHover={{ y: -3 }}
              className="bg-surface border border-border rounded-lg p-5 shadow-xs transition-shadow hover:shadow-sm"
            >
              <div className="flex items-center gap-1.5 text-verified mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-[11px] font-semibold tracking-wide uppercase">Additions</span>
              </div>
              <p className="text-2xl font-bold font-data text-foreground">
                <AnimatedCounter value={primaryComparison.additions} prefix="+" />
              </p>
              <p className="text-xs text-muted mt-1">
                {((primaryComparison.additions / primaryComparison.totalBaseline) * 100).toFixed(2)}% of baseline
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -3 }}
              className="bg-surface border border-border rounded-lg p-5 shadow-xs transition-shadow hover:shadow-sm"
            >
              <div className="flex items-center gap-1.5 text-critical mb-1">
                <TrendingDown className="w-4 h-4" />
                <span className="text-[11px] font-semibold tracking-wide uppercase">Deletions</span>
              </div>
              <p className="text-2xl font-bold font-data text-foreground">
                <AnimatedCounter value={primaryComparison.deletions} prefix="−" />
              </p>
              <p className="text-xs text-muted mt-1">
                {((primaryComparison.deletions / primaryComparison.totalBaseline) * 100).toFixed(2)}% of baseline
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -3 }}
              className="bg-surface border border-border rounded-lg p-5 shadow-xs transition-shadow hover:shadow-sm"
            >
              <div className="flex items-center gap-1.5 text-caution mb-1">
                <FileCheck className="w-4 h-4" />
                <span className="text-[11px] font-semibold tracking-wide uppercase">Corrections</span>
              </div>
              <p className="text-2xl font-bold font-data text-foreground">
                <AnimatedCounter value={primaryComparison.corrections} />
              </p>
              <p className="text-xs text-muted mt-1">
                {((primaryComparison.corrections / primaryComparison.totalBaseline) * 100).toFixed(2)}% modified
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -3 }}
              className="bg-surface border border-border rounded-lg p-5 shadow-xs transition-shadow hover:shadow-sm"
            >
              <div className="flex items-center gap-1.5 text-foreground mb-1">
                <Layers className="w-4 h-4 text-muted" />
                <span className="text-[11px] font-semibold tracking-wide uppercase">Net Change</span>
              </div>
              <p className="text-2xl font-bold font-data text-foreground">
                <AnimatedCounter value={primaryComparison.additions - primaryComparison.deletions} prefix="+" />
              </p>
              <p className="text-xs text-muted mt-1">
                Target total: {formatNumber(primaryComparison.totalTarget)}
              </p>
            </motion.div>
          </div>

          {/* Graphical Rate Comparison */}
          <div className="bg-surface border border-border rounded-md p-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Constituency Rate Variance (Additions vs Deletions %)
                </h3>
                <p className="text-xs text-muted">
                  Observed gross percentage shift by geographic subunit
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-data">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-[#F07824] rounded-xs inline-block" /> Additions %
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-[#2563EB] rounded-xs inline-block" /> Deletions %
                </span>
              </div>
            </div>

            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={filteredAreas.slice(0, 10).map((a) => ({
                    name: a.areaName.replace(" Assembly", "").replace(" Ward", "").replace(" Block", ""),
                    additions: a.additionRate,
                    deletions: a.deletionRate,
                  }))}
                  margin={{ top: 10, right: 10, bottom: 20, left: -20 }}
                  barGap={4}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748B" }} tickLine={false} interval={0} angle={-20} textAnchor="end" />
                  <YAxis tick={{ fontSize: 10, fill: "#64748B" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                  <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 6, border: "1px solid #E2E8F0", backgroundColor: "#FFFFFF" }}
                    formatter={(val, name) => [`${val}%`, name === "additions" ? "Addition Rate" : "Deletion Rate"]}
                  />
                  <Bar dataKey="additions" fill="#F07824" radius={[3, 3, 0, 0]} maxBarSize={24} />
                  <Bar dataKey="deletions" fill="#2563EB" radius={[3, 3, 0, 0]} maxBarSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Filter, Search & Export Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  placeholder="Filter by constituency or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-surface border border-border rounded pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              <div className="flex items-center gap-1 border border-border rounded bg-surface p-0.5 text-xs">
                {(["all", "Assembly", "Ward", "Block"] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setGeoFilter(level)}
                    className={`px-2.5 py-1 rounded-xs transition-colors ${
                      geoFilter === level ? "bg-foreground text-surface font-medium" : "text-muted hover:text-foreground"
                    }`}
                  >
                    {level === "all" ? "All Levels" : level}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted mr-1">{filteredAreas.length} subunits shown</span>
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-surface border border-border hover:border-foreground/30 rounded transition-colors text-foreground"
              >
                <Download className="w-3.5 h-3.5" />
                CSV
              </button>
              <button
                onClick={handleExportJSON}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-surface border border-border hover:border-foreground/30 rounded transition-colors text-foreground"
              >
                <Download className="w-3.5 h-3.5" />
                JSON
              </button>
            </div>
          </div>

          {/* Breakdown Data Table */}
          <div className="bg-surface border border-border rounded-md overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full text-xs" role="table">
                <thead>
                  <tr className="border-b border-border bg-background/60">
                    <th
                      onClick={() => handleSort("areaCode")}
                      className="text-left py-3 px-4 font-semibold text-muted uppercase cursor-pointer hover:text-foreground"
                    >
                      <div className="flex items-center gap-1">
                        Code <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("areaName")}
                      className="text-left py-3 px-4 font-semibold text-muted uppercase cursor-pointer hover:text-foreground"
                    >
                      <div className="flex items-center gap-1">
                        Area Name <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("totalRecords")}
                      className="text-right py-3 px-4 font-semibold text-muted uppercase cursor-pointer hover:text-foreground"
                    >
                      <div className="flex items-center justify-end gap-1">
                        Total Electorate <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("additions")}
                      className="text-right py-3 px-4 font-semibold text-muted uppercase cursor-pointer hover:text-foreground"
                    >
                      <div className="flex items-center justify-end gap-1">
                        Additions <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("additionRate")}
                      className="text-right py-3 px-4 font-semibold text-muted uppercase cursor-pointer hover:text-foreground"
                    >
                      <div className="flex items-center justify-end gap-1">
                        Add % <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("deletions")}
                      className="text-right py-3 px-4 font-semibold text-muted uppercase cursor-pointer hover:text-foreground"
                    >
                      <div className="flex items-center justify-end gap-1">
                        Deletions <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("deletionRate")}
                      className="text-right py-3 px-4 font-semibold text-muted uppercase cursor-pointer hover:text-foreground"
                    >
                      <div className="flex items-center justify-end gap-1">
                        Del % <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("corrections")}
                      className="text-right py-3 px-4 font-semibold text-muted uppercase cursor-pointer hover:text-foreground"
                    >
                      <div className="flex items-center justify-end gap-1">
                        Modifications <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredAreas.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-muted">
                        No geographic units match the active search and filter parameters.
                      </td>
                    </tr>
                  ) : (
                    filteredAreas.map((area) => (
                      <tr key={area.areaCode} className="hover:bg-background/40 transition-colors">
                        <td className="py-2.5 px-4 font-data text-muted">{area.areaCode}</td>
                        <td className="py-2.5 px-4 font-medium text-foreground">
                          {area.areaName}
                        </td>
                        <td className="py-2.5 px-4 text-right font-data">{formatNumber(area.totalRecords)}</td>
                        <td className="py-2.5 px-4 text-right font-data font-semibold text-verified">
                          +{formatNumber(area.additions)}
                        </td>
                        <td className="py-2.5 px-4 text-right font-data font-semibold text-verified">
                          {area.additionRate.toFixed(2)}%
                        </td>
                        <td className="py-2.5 px-4 text-right font-data font-semibold text-critical">
                          −{formatNumber(area.deletions)}
                        </td>
                        <td className="py-2.5 px-4 text-right font-data font-semibold text-critical">
                          {area.deletionRate.toFixed(2)}%
                        </td>
                        <td className="py-2.5 px-4 text-right font-data text-muted">
                          {formatNumber(area.corrections)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Associated Findings in this Comparison */}
          <div className="bg-surface border border-border rounded-md p-6">
            <h3 className="text-base font-bold text-foreground mb-1">
              Automated Statistical Findings for this Roll Pair
            </h3>
            <p className="text-xs text-muted mb-4">
              {comparisonFindings.length} findings flagged by rule-based auditing algorithms for this baseline/target snapshot.
            </p>

            <div className="space-y-3">
              {comparisonFindings.map((finding) => (
                <div
                  key={finding.id}
                  className="p-4 border border-border/80 rounded bg-background/50 flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-data text-xs font-bold text-foreground">{finding.id}</span>
                      <Badge variant={finding.signalStrength === "strong" ? "signal-strong" : "signal-moderate"}>
                        {finding.signalStrength} signal
                      </Badge>
                      <span className="text-xs text-muted">• {finding.area}</span>
                    </div>
                    <p className="text-xs text-foreground/80">{finding.explanation}</p>
                  </div>
                  <Link
                    href={`/findings/${finding.id}`}
                    className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline shrink-0"
                  >
                    Inspect complete evidence <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
