"use client";

import { useEffect, useRef } from "react";
import { createChart, ColorType, AreaSeries, type IChartApi } from "lightweight-charts";

function genSeries(basePrice: number) {
  const now = Math.floor(Date.now() / 1000);
  const points = [];
  let price = basePrice * 0.6;
  for (let i = 200; i >= 0; i--) {
    price *= 1 + (Math.random() - 0.47) * 0.04;
    points.push({ time: (now - i * 900) as any, value: Math.max(price, basePrice * 0.05) });
  }
  return points;
}

export default function PriceChart({ basePrice }: { basePrice: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#8a9bb3",
      },
      grid: {
        vertLines: { color: "#1f2c40" },
        horzLines: { color: "#1f2c40" },
      },
      width: containerRef.current.clientWidth,
      height: 360,
      timeScale: { borderColor: "#1f2c40" },
      rightPriceScale: { borderColor: "#1f2c40" },
    });
    const series = chart.addSeries(AreaSeries, {
      lineColor: "#3ddc84",
      topColor: "rgba(61, 220, 132, 0.35)",
      bottomColor: "rgba(61, 220, 132, 0.02)",
      lineWidth: 2,
    });
    series.setData(genSeries(basePrice));
    chart.timeScale().fitContent();
    chartRef.current = chart;

    const onResize = () => {
      if (containerRef.current) chart.applyOptions({ width: containerRef.current.clientWidth });
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      chart.remove();
    };
  }, [basePrice]);

  return <div ref={containerRef} className="w-full" />;
}
