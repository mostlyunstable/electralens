"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      onClick={() => {
        if (typeof window !== "undefined") window.print();
      }}
      className="btn-pill-sm btn-outline flex items-center gap-2 cursor-pointer"
    >
      <Printer className="w-3.5 h-3.5 text-[#475467]" />
      <span>Print Record</span>
    </button>
  );
}
