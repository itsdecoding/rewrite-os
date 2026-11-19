"use client";

import React from "react";
import Link from "next/link";
import {
  PieChart as PieIcon,
  BarChart3,
  TrendingUp,
  Layers,
  CheckCircle2,
  Clock,
  ArrowRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { Header } from "@/components/layout/Header";
import { useContent } from "@/context/ContentContext";
import { COLUMNS } from "@/data/mockData";

export default function InsightsPage() {
  const { cards } = useContent();

  const total = cards.length;
  const posted = cards.filter((c) => c.status === "Posted").length;
  const inPipeline = cards.filter((c) => c.status !== "Posted" && c.status !== "Dismissed").length;
  const reviewPending = cards.filter((c) => c.status === "For Review" || c.status === "Requires Revision").length;

  // By Status chart data
  const statusData = COLUMNS.map((col) => {
    const count = cards.filter((c) => c.status === col.id).length;
    return {
      name: col.title,
      count,
      color: col.colorDot,
    };
  });

  // By Format chart data
  const formats = [
    "IG Carousel",
    "IG Reel · Standard",
    "IG B-roll · Trial",
    "LinkedIn",
    "X / Twitter",
    "YouTube Long",
  ];

  const formatData = formats.map((f) => ({
    name: f.replace(" · Standard", "").replace(" · Trial", ""),
    count: cards.filter((c) => c.type.includes(f.split(" · ")[0])).length,
  }));

  const COLORS = ["#FF5A1F", "#60A5FA", "#F472B6", "#10B981", "#F59E0B", "#8B5CF6"];

  return (
    <div className="min-h-screen pb-20">
      <Header />

      <main className="px-4 sm:px-6 md:px-8 max-w-[1440px] mx-auto space-y-6 pt-2">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              ANALYTICS & METRICS
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] tracking-tight">
              Production Velocity & Insights
            </h1>
            <p className="text-[13px] text-gray-500 mt-0.5">
              Editorial throughput, content asset balance, and pipeline stage health.
            </p>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Total Cards
              </span>
              <Layers className="w-4 h-4 text-[#FF5A1F]" />
            </div>
            <div className="text-3xl font-extrabold text-gray-900">{total}</div>
            <span className="text-[11px] text-gray-400 mt-1 block">Live in database</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Active in Flight
              </span>
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-3xl font-extrabold text-gray-900">{inPipeline}</div>
            <span className="text-[11px] text-gray-400 mt-1 block">Idea through Editing</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Review Bottlenecks
              </span>
              <TrendingUp className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-3xl font-extrabold text-gray-900">{reviewPending}</div>
            <span className="text-[11px] text-gray-400 mt-1 block">Needs attention</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Published Output
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-extrabold text-gray-900">{posted}</div>
            <span className="text-[11px] text-gray-400 mt-1 block">Fully completed</span>
          </div>
        </div>

        {/* 2-Column Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Format Volume Bar Chart */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Distribution by Format</h3>
                <p className="text-xs text-gray-400">Total volume per content channel</p>
              </div>
            </div>

            <div className="h-[260px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formatData}>
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} tickLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#18181b",
                      borderRadius: "12px",
                      border: "none",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {formatData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pipeline Stage Volume */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Pipeline Stage Health</h3>
                <p className="text-xs text-gray-400">Active distribution across all 8 stages</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {statusData.map((s) => (
                <div key={s.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-700 flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: s.color }}
                      />
                      {s.name}
                    </span>
                    <span className="font-bold text-gray-900">{s.count}</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        backgroundColor: s.color,
                        width: `${total > 0 ? (s.count / total) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
