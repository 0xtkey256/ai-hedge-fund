"use client";

export default function FormulaBar() {
  return (
    <div className="flex items-center justify-center gap-4 p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
      <div className="text-sm font-mono text-gray-300">
        dS = <span className="text-yellow-400">{"\u03BC"}(t)</span> {"\u00B7"} S {"\u00B7"} dt +{" "}
        <span className="text-green-400">{"\u03C3"}(t)</span> {"\u00B7"} S {"\u00B7"} dW
      </div>
      <div className="h-4 w-px bg-white/10" />
      <div className="flex gap-3 text-[10px] font-mono">
        <span>
          <span className="text-yellow-400">{"\u03BC"}</span>
          <span className="text-gray-600"> = base + f(</span>
          <span className="text-purple-400">Schwarzwald</span>
          <span className="text-gray-600">)</span>
        </span>
        <span>
          <span className="text-green-400">{"\u03C3"}</span>
          <span className="text-gray-600"> = base + g(</span>
          <span className="text-purple-400">Schwarzwald</span>
          <span className="text-gray-600">)</span>
        </span>
      </div>
    </div>
  );
}
