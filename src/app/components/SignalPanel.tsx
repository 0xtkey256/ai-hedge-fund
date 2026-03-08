"use client";

import { useEffect, useState } from "react";

interface Signal {
  commodity: string;
  direction: "LONG" | "SHORT";
  confidence: number;
  source: string;
  mu_adj: number;
  sigma_adj: number;
}

const signals: Signal[] = [
  { commodity: "Soybeans (ZS)", direction: "SHORT", confidence: 0.87, source: "BR drought news", mu_adj: -0.12, sigma_adj: 0.35 },
  { commodity: "Copper (HG)", direction: "SHORT", confidence: 0.72, source: "CL mining strike", mu_adj: -0.08, sigma_adj: 0.28 },
  { commodity: "Semiconductors", direction: "SHORT", confidence: 0.65, source: "JP export ban", mu_adj: -0.06, sigma_adj: 0.22 },
  { commodity: "Coffee (KC)", direction: "LONG", confidence: 0.58, source: "BR export record", mu_adj: 0.05, sigma_adj: 0.18 },
];

export default function SignalPanel() {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible((p) => Math.min(p + 1, signals.length));
    }, 700);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-2">
      {signals.slice(0, visible).map((sig, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05] hover:border-green-500/20 transition-all animate-news"
        >
          <div className="flex items-center gap-3">
            <span
              className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                sig.direction === "LONG"
                  ? "bg-green-500/15 text-green-400"
                  : "bg-red-500/15 text-red-400"
              }`}
            >
              {sig.direction}
            </span>
            <div>
              <div className="text-[12px] font-semibold text-gray-200">{sig.commodity}</div>
              <div className="text-[9px] text-gray-600 font-mono">{sig.source}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] font-mono text-gray-300">
              {(sig.confidence * 100).toFixed(0)}%
            </div>
            <div className="flex gap-2 text-[8px] font-mono text-gray-600">
              <span>\u03BC {sig.mu_adj > 0 ? "+" : ""}{sig.mu_adj.toFixed(2)}</span>
              <span>\u03C3 +{sig.sigma_adj.toFixed(2)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
