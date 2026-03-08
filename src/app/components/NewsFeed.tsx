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
    flag: "\u{1F1E7}\u{1F1F7}",
    source: "Folha de S.Paulo",
    headline: "Seca severa atinge planta\u00e7\u00f5es de soja no Mato Grosso",
    commodity: "Soybeans",
    sentiment: -0.82,
    impact: "HIGH",
    time: "2m",
  },
  {
    lang: "JA",
    flag: "\u{1F1EF}\u{1F1F5}",
    source: "\u65E5\u672C\u7D4C\u6E08\u65B0\u805E",
    headline: "\u534A\u5C0E\u4F53\u8F38\u51FA\u898F\u5236\u306E\u5F37\u5316\u3092\u691C\u8A0E\u3001\u7D4C\u7523\u7701\u304C\u767A\u8868",
    commodity: "Semiconductors",
    sentiment: -0.65,
    impact: "HIGH",
    time: "8m",
  },
  {
    lang: "ES",
    flag: "\u{1F1E8}\u{1F1F1}",
    source: "El Mercurio",
    headline: "Producci\u00f3n de cobre cae un 12% por huelga minera",
    commodity: "Copper",
    sentiment: -0.71,
    impact: "MED",
    time: "15m",
  },
  {
    lang: "PT-BR",
    flag: "\u{1F1E7}\u{1F1F7}",
    source: "Valor Econ\u00f4mico",
    headline: "Exporta\u00e7\u00f5es de caf\u00e9 atingem recorde em fevereiro",
    commodity: "Coffee",
    sentiment: 0.58,
    impact: "MED",
    time: "23m",
  },
  {
    lang: "JA",
    flag: "\u{1F1EF}\u{1F1F5}",
    source: "NHK",
    headline: "\u30C8\u30E8\u30BF\u3001\u65B0\u578BEV\u96FB\u6C60\u306E\u91CF\u7523\u958B\u59CB\u3092\u524D\u5012\u3057",
    commodity: "Lithium",
    sentiment: 0.45,
    impact: "LOW",
    time: "31m",
  },
  {
    lang: "PT-BR",
    flag: "\u{1F1E7}\u{1F1F7}",
    source: "G1 Agro",
    headline: "Geada inesperada causa preju\u00edzo em planta\u00e7\u00f5es de cana",
    commodity: "Sugar",
    sentiment: -0.55,
    impact: "MED",
    time: "42m",
  },
];

export default function NewsFeed() {
  const [visibleItems, setVisibleItems] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleItems((prev) => Math.min(prev + 1, mockNews.length));
    }, 500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-2 overflow-y-auto pr-1" style={{ maxHeight: 400 }}>
      {mockNews.slice(0, visibleItems).map((item, i) => (
        <div
          key={i}
          className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05] hover:border-green-500/20 transition-all animate-news"
        >
          <span className="text-lg mt-0.5">{item.flag}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[9px] font-mono text-gray-600 bg-white/5 px-1 py-0.5 rounded">
                {item.lang}
              </span>
              <span className="text-[10px] text-gray-600 truncate">{item.source}</span>
              <span className="text-[9px] text-gray-700 ml-auto flex-shrink-0">{item.time}</span>
            </div>
            <p className="text-[12px] text-gray-300 leading-snug truncate">{item.headline}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-mono text-gray-500">{item.commodity}</span>
              <span
                className={`text-[10px] font-mono font-bold ${
                  item.sentiment < 0 ? "text-red-400" : "text-green-400"
                }`}
              >
                {item.sentiment > 0 ? "+" : ""}
                {item.sentiment.toFixed(2)}
              </span>
              <span
                className={`text-[8px] font-mono px-1 py-0.5 rounded ${
                  item.impact === "HIGH"
                    ? "bg-red-500/15 text-red-400"
                    : item.impact === "MED"
                    ? "bg-yellow-500/15 text-yellow-400"
                    : "bg-gray-500/15 text-gray-500"
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
