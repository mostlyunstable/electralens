"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      onClick={() => {
        if (typeof window !== "undefined") window.print();
      }}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-surface border border-border hover:bg-background rounded transition-colors text-foreground"
    >
      <Printer className="w-3.5 h-3.5" />
      Print Record
    </button>
  );
}
