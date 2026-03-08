"use client";

import { useEffect, useState } from "react";

interface NewsItem {
  lang: string;
  flag: string;
  source: string;
  headline: string;
  commodity: string;
  sentiment: number;
  impact: string;
  time: string;
}

const mockNews: NewsItem[] = [
  {
    lang: "PT-BR",
    flag: "🇧🇷",
    source: "Folha de S.Paulo",
    headline: "Seca severa atinge plantações de soja no Mato Grosso",
    commodity: "Soybeans",
    sentiment: -0.82,
    impact: "HIGH",
    time: "2 min ago",
  },
  {
    lang: "JA",
    flag: "🇯🇵",
    source: "日本経済新聞",
    headline: "半導体輸出規制の強化を検討、経産省が発表",
    commodity: "Semiconductors",
    sentiment: -0.65,
    impact: "HIGH",
    time: "8 min ago",
  },
  {
    lang: "ES",
    flag: "🇨🇱",
    source: "El Mercurio",
    headline: "Producción de cobre cae un 12% por huelga minera",
    commodity: "Copper",
    sentiment: -0.71,
    impact: "MEDIUM",
    time: "15 min ago",
  },
  {
    lang: "PT-BR",
    flag: "🇧🇷",
    source: "Valor Econômico",
    headline: "Exportações de café atingem recorde em fevereiro",
    commodity: "Coffee",
    sentiment: 0.58,
    impact: "MEDIUM",
    time: "23 min ago",
  },
  {
    lang: "JA",
    flag: "🇯🇵",
    source: "NHK",
    headline: "トヨタ、新型EV電池の量産開始を前倒し",
    commodity: "Lithium",
    sentiment: 0.45,
    impact: "LOW",
    time: "31 min ago",
  },
];

export default function NewsFeed() {
  const [visibleItems, setVisibleItems] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleItems((prev) => Math.min(prev + 1, mockNews.length));
    }, 600);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-3">
      {mockNews.slice(0, visibleItems).map((item, i) => (
        <div
          key={i}
          className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all animate-fade-in"
        >
          <span className="text-2xl">{item.flag}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono text-gray-500 bg-white/5 px-1.5 py-0.5 rounded">
                {item.lang}
              </span>
              <span className="text-[11px] text-gray-500">{item.source}</span>
              <span className="text-[10px] text-gray-600 ml-auto">{item.time}</span>
            </div>
            <p className="text-sm text-gray-300 leading-snug truncate">{item.headline}</p>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-[11px] font-mono text-gray-400">{item.commodity}</span>
              <span
                className={`text-[11px] font-mono font-bold ${
                  item.sentiment < 0 ? "text-red-400" : "text-green-400"
                }`}
              >
                {item.sentiment > 0 ? "+" : ""}
                {item.sentiment.toFixed(2)}
              </span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  item.impact === "HIGH"
                    ? "bg-red-500/20 text-red-400"
                    : item.impact === "MEDIUM"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-gray-500/20 text-gray-400"
                }`}
              >
                {item.impact}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
