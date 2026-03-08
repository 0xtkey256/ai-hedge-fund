"use client";

import { useEffect, useState } from "react";

export default function StatsBar() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }) + " JST"
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: "SIGNALS", value: "4", color: "text-green-400" },
    { label: "EDGE", value: "3-8h", color: "text-yellow-400" },
    { label: "MC PATHS", value: "10K", color: "text-blue-400" },
    { label: "LANGUAGES", value: "5", color: "text-purple-400" },
    { label: "SOURCES", value: "12", color: "text-cyan-400" },
  ];

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-white/[0.02] border-b border-white/[0.05]">
      <div className="flex items-center gap-6">
        {stats.map((s, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span className="text-[9px] font-mono text-gray-600">{s.label}</span>
            <span className={`text-[12px] font-mono font-bold ${s.color}`}>{s.value}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 signal-live" />
          <span className="text-[9px] font-mono text-green-400">LIVE</span>
        </div>
        <span className="text-[10px] font-mono text-gray-600">{time}</span>
      </div>
    </div>
  );
}
