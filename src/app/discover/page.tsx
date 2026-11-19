"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Compass,
  Sparkles,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Brain,
  Zap,
  Check,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { useContent } from "@/context/ContentContext";

interface RadarSignal {
  id: string;
  category: string;
  title: string;
  hook: string;
  format: string;
  source: string;
}

const PRESET_SIGNALS: RadarSignal[] = [
  {
    id: "sig-1",
    category: "Cognitive Biases",
    title: "The Solomon's Paradox: Why You Give Great Advice to Friends but Ruin Your Own Life",
    hook: "You can solve your friend's 3-year crisis in 10 minutes. Here's the psychological split that blinds you to your own.",
    format: "IG Carousel",
    source: "Psychological Science & Stoic Dual-Perspective",
  },
  {
    id: "sig-2",
    category: "Mental Models",
    title: "First-Order vs Second-Order Thinking: How Quick Fixes Compound Into Traps",
    hook: "Every solution creates a new problem. High-agency operators solve the second problem before taking the first step.",
    format: "IG Reel · Standard",
    source: "Systems Dynamics & Howard Marks",
  },
  {
    id: "sig-3",
    category: "Behavioral Inertia",
    title: "The 20-Second Activation Energy: How Environmental Architecture Beats Willpower",
    hook: "If it takes more than 20 seconds to start, your brain treats it as a threat. How to weaponize friction.",
    format: "IG Carousel",
    source: "Behavioral Psychology & Habit Design",
  },
  {
    id: "sig-4",
    category: "Epistemic Autonomy",
    title: "The Mimetic Trap: You Don't Actually Want What You Think You Want",
    hook: "Human desire is not innate; it is copied. How to tell which 50% of your ambitions are borrowed from your feed.",
    format: "IG Carousel",
    source: "René Girard & Applied Epistemology",
  },
  {
    id: "sig-5",
    category: "Stoic Psychology",
    title: "Amor Fati: The Cognitive Reframing Technique Marcus Aurelius Used Under Plague",
    hook: "Don't just tolerate resistance. Train your mental model to view the obstacle as fuel for the next move.",
    format: "YouTube Long",
    source: "Stoic Meditations & Cognitive Reframing",
  },
  {
    id: "sig-6",
    category: "Modern Leverage",
    title: "Why Autonomous AI Coding Changes Creative Leverage for Solo Founders",
    hook: "The developer constraint is dead. The bottleneck is now taste, curation, and epistemic clarity.",
    format: "LinkedIn",
    source: "Tech Shifts & Creator Economy",
  },
];

export default function DiscoverPage() {
  const { addCard } = useContent();

  const [signals, setSignals] = useState<RadarSignal[]>(PRESET_SIGNALS);
  const [promotedIds, setPromotedIds] = useState<Set<string>>(new Set());
  const [customTopic, setCustomTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePromoteToBoard = (signal: RadarSignal) => {
    addCard({
      title: signal.title,
      type: signal.format,
      category: signal.category,
      status: "Idea",
      priority: "High",
      slideCopy: `Slide 1 (Hook):\n${signal.hook}\n\nSlide 2 (The Underlying Problem):\nWhy most people misdiagnose this tension...\n\nSlide 3 (The Mental Reframe):\nThe counterintuitive insight from ${signal.source}...`,
      tags: signal.category.toLowerCase().replace(/\s+/g, "-"),
    });

    setPromotedIds((prev) => new Set(prev).add(signal.id));
  };

  const handleGenerateCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTopic.trim()) return;

    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "suggest_hooks",
          title: customTopic,
          category: "Mindset & Philosophy",
        }),
      });
      const data = await res.json();
      const generatedAngle = data.text || customTopic;

      const newSig: RadarSignal = {
        id: "sig-" + Date.now(),
        category: "Cognitive Reframing",
        title: customTopic,
        hook: generatedAngle.split("\n")[0] || customTopic,
        format: "IG Carousel",
        source: "Rewrite Minds AI Engine",
      };

      setSignals([newSig, ...signals]);
      setCustomTopic("");
    } catch (e) {
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <Header />

      <main className="px-4 sm:px-6 md:px-8 max-w-[1440px] mx-auto space-y-6 pt-2">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              RADAR & IDEATION
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] tracking-tight">
              Rewrite Minds Idea Radar
            </h1>
            <p className="text-[13px] text-gray-500 mt-0.5">
              Live conceptual radar, mental model frameworks, and high-CTR premise hunter.
            </p>
          </div>
        </div>

        {/* AI Topic Scanner Box */}
        <div className="bg-gradient-to-r from-orange-50 via-white to-orange-50/40 rounded-2xl border border-orange-200/80 p-5 shadow-xs">
          <form onSubmit={handleGenerateCustom} className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF5A1F]" />
              <h3 className="text-sm font-bold text-gray-900">
                AI Premise & Angle Generator
              </h3>
            </div>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="Enter a topic or psychological tension (e.g. 'imposter syndrome in high performers')..."
                className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#FF5A1F] shadow-xs"
              />
              <button
                type="submit"
                disabled={isGenerating}
                className="bg-[#FF5A1F] hover:bg-[#E84C12] active:scale-95 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {isGenerating ? (
                  <span>Scanning...</span>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    <span>Generate Signal</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Radar Signals Feed */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {signals.map((sig) => {
            const isPromoted = promotedIds.has(sig.id);

            return (
              <div
                key={sig.id}
                className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-[#FFF0E8] text-[#FF5A1F]">
                      {sig.category}
                    </span>
                    <span className="text-[11px] text-gray-400 font-medium">
                      {sig.format}
                    </span>
                  </div>

                  <h3 className="text-[15px] font-bold text-gray-900 leading-snug group-hover:text-[#FF5A1F] transition-colors">
                    {sig.title}
                  </h3>

                  <p className="text-[12.5px] text-gray-600 bg-gray-50/80 p-3 rounded-xl border border-gray-100 font-normal leading-relaxed">
                    &ldquo;{sig.hook}&rdquo;
                  </p>

                  <span className="text-[11px] text-gray-400 font-mono block">
                    Source: {sig.source}
                  </span>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11.5px] text-gray-400">
                    Status: {isPromoted ? "In Pipeline" : "Fresh Signal"}
                  </span>

                  <button
                    onClick={() => handlePromoteToBoard(sig)}
                    disabled={isPromoted}
                    className={`text-xs font-semibold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                      isPromoted
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-gray-900 hover:bg-black text-white shadow-xs"
                    }`}
                  >
                    {isPromoted ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Added to Board</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Add to Board</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
