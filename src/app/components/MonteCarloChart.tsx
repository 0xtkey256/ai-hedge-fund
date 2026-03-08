"use client";

import { useEffect, useRef, useState } from "react";

interface SimulationResult {
  vanilla: number[][];
  aiEnhanced: number[][];
  actualPrice: number[];
}

function generateBrownianMotion(
  startPrice: number,
  days: number,
  mu: number,
  sigma: number,
  paths: number
): number[][] {
  const dt = 1 / 252;
  const results: number[][] = [];
  for (let p = 0; p < paths; p++) {
    const path = [startPrice];
    for (let i = 1; i < days; i++) {
      const randomShock =
        Math.sqrt(dt) *
        (Math.sqrt(-2 * Math.log(Math.random())) *
          Math.cos(2 * Math.PI * Math.random()));
      const drift = (mu - 0.5 * sigma * sigma) * dt;
      const diffusion = sigma * randomShock;
      path.push(path[i - 1] * Math.exp(drift + diffusion));
    }
    results.push(path);
  }
  return results;
}

function generateActualPrice(startPrice: number, days: number): number[] {
  const path = [startPrice];
  const trend = 0.15;
  const vol = 0.22;
  const dt = 1 / 252;
  for (let i = 1; i < days; i++) {
    const shock =
      Math.sqrt(dt) *
      (Math.sqrt(-2 * Math.log(Math.random())) *
        Math.cos(2 * Math.PI * Math.random()));
    let eventShock = 0;
    if (i === 15) eventShock = -0.035;
    if (i === 16) eventShock = -0.02;
    if (i === 20) eventShock = 0.015;
    path.push(
      path[i - 1] *
        Math.exp((trend - 0.5 * vol * vol) * dt + vol * shock + eventShock)
    );
  }
  return path;
}

export default function MonteCarloChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [sim, setSim] = useState<SimulationResult | null>(null);
  const animFrameRef = useRef(0);

  const runSimulation = () => {
    const startPrice = 100;
    const days = 60;
    const numPaths = 50;
    const vanilla = generateBrownianMotion(startPrice, days, 0.08, 0.25, numPaths);
    const aiEnhanced = generateBrownianMotion(startPrice, days, 0.06, 0.3, numPaths);
    for (const path of aiEnhanced) {
      for (let i = 14; i < days; i++) {
        path[i] = path[i] * (1 - 0.03 * (1 - (i - 14) / (days - 14)));
      }
    }
    const actualPrice = generateActualPrice(startPrice, days);
    setSim({ vanilla, aiEnhanced, actualPrice });
  };

  useEffect(() => {
    runSimulation();
  }, []);

  useEffect(() => {
    if (!sim || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const padding = { top: 35, right: 20, bottom: 45, left: 50 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const allPrices = [
      ...sim.vanilla.flat(),
      ...sim.aiEnhanced.flat(),
      ...sim.actualPrice,
    ];
    const minP = Math.min(...allPrices) * 0.98;
    const maxP = Math.max(...allPrices) * 1.02;
    const days = sim.actualPrice.length;

    const xScale = (i: number) => padding.left + (i / (days - 1)) * chartW;
    const yScale = (p: number) =>
      padding.top + chartH - ((p - minP) / (maxP - minP)) * chartH;

    let step = 0;
    const totalSteps = days;

    const draw = () => {
      step = Math.min(step + 1, totalSteps);
      ctx.clearRect(0, 0, width, height);

      // Dark bg
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, width, height);

      // Grid
      ctx.strokeStyle = "rgba(34, 197, 94, 0.06)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= 5; i++) {
        const y = padding.top + (i / 5) * chartH;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();
        ctx.fillStyle = "#444";
        ctx.font = "10px monospace";
        ctx.textAlign = "right";
        const price = maxP - (i / 5) * (maxP - minP);
        ctx.fillText(`$${price.toFixed(0)}`, padding.left - 6, y + 3);
      }

      // X labels
      ctx.fillStyle = "#444";
      ctx.font = "10px monospace";
      ctx.textAlign = "center";
      for (let i = 0; i <= 4; i++) {
        const dayNum = Math.round((i / 4) * (days - 1));
        ctx.fillText(`D${dayNum}`, xScale(dayNum), height - padding.bottom + 16);
      }

      // News event zone
      if (step >= 15) {
        const grad = ctx.createLinearGradient(
          xScale(14), 0, xScale(17), 0
        );
        grad.addColorStop(0, "rgba(239, 68, 68, 0.0)");
        grad.addColorStop(0.3, "rgba(239, 68, 68, 0.12)");
        grad.addColorStop(0.7, "rgba(239, 68, 68, 0.12)");
        grad.addColorStop(1, "rgba(239, 68, 68, 0.0)");
        ctx.fillStyle = grad;
        ctx.fillRect(xScale(13), padding.top, xScale(18) - xScale(13), chartH);

        ctx.fillStyle = "#ef4444";
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.fillText("NEWS EVENT", xScale(15.5), padding.top + 14);
        ctx.font = "8px monospace";
        ctx.fillStyle = "#f87171";
        ctx.fillText("Schwarzwald detected", xScale(15.5), padding.top + 26);
      }

      // Vanilla paths
      for (const path of sim.vanilla) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(100, 100, 255, 0.08)";
        ctx.lineWidth = 0.8;
        for (let i = 0; i < step; i++) {
          if (i === 0) ctx.moveTo(xScale(i), yScale(path[i]));
          else ctx.lineTo(xScale(i), yScale(path[i]));
        }
        ctx.stroke();
      }

      // Schwarzwald paths
      for (const path of sim.aiEnhanced) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(34, 197, 94, 0.1)";
        ctx.lineWidth = 0.8;
        for (let i = 0; i < step; i++) {
          if (i === 0) ctx.moveTo(xScale(i), yScale(path[i]));
          else ctx.lineTo(xScale(i), yScale(path[i]));
        }
        ctx.stroke();
      }

      // Actual price
      ctx.beginPath();
      ctx.strokeStyle = "#facc15";
      ctx.lineWidth = 2.5;
      ctx.shadowColor = "rgba(250, 204, 21, 0.4)";
      ctx.shadowBlur = 8;
      for (let i = 0; i < step; i++) {
        if (i === 0) ctx.moveTo(xScale(i), yScale(sim.actualPrice[i]));
        else ctx.lineTo(xScale(i), yScale(sim.actualPrice[i]));
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Legend
      const legendY = height - 8;
      ctx.font = "10px monospace";
      ctx.textAlign = "left";

      ctx.fillStyle = "rgba(100, 100, 255, 0.5)";
      ctx.fillRect(padding.left, legendY - 6, 12, 2);
      ctx.fillStyle = "#555";
      ctx.fillText("Vanilla", padding.left + 16, legendY - 1);

      ctx.fillStyle = "rgba(34, 197, 94, 0.6)";
      ctx.fillRect(padding.left + 85, legendY - 6, 12, 2);
      ctx.fillStyle = "#555";
      ctx.fillText("Schwarzwald", padding.left + 101, legendY - 1);

      ctx.fillStyle = "#facc15";
      ctx.fillRect(padding.left + 200, legendY - 6, 12, 2);
      ctx.fillStyle = "#555";
      ctx.fillText("Actual", padding.left + 216, legendY - 1);

      if (step < totalSteps) {
        animFrameRef.current = requestAnimationFrame(draw);
      }
    };

    step = 0;
    draw();
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [sim]);

  return (
    <div className="relative h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full rounded-lg"
        style={{ minHeight: 280 }}
      />
      <button
        onClick={runSimulation}
        className="absolute top-2 right-2 px-2 py-1 text-[10px] font-mono bg-white/5 hover:bg-white/10 rounded border border-white/10 transition-colors text-gray-400"
      >
        Re-run
      </button>
    </div>
  );
}
