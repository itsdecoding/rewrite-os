"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Sparkles,
  Shuffle,
  MoreHorizontal,
  Save,
  ChevronDown,
  Calendar as CalendarIcon,
  Clock,
  ExternalLink,
  Layers,
  Copy,
  Check,
  History,
  X,
  FileText,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { useContent } from "@/context/ContentContext";
import { ContentCard } from "@/data/mockData";

export default function ContentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { cards, getCardById, updateCard } = useContent();

  const cardId = (params?.id as string) || "";
  const [card, setCard] = useState<ContentCard | null>(() => {
    if (!cardId) return null;
    return getCardById(cardId) || cards.find((c) => c.id === cardId || c.id === decodeURIComponent(cardId)) || null;
  });

  const [isSavedMessage, setIsSavedMessage] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // AI Copilot state
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiOutput, setAiOutput] = useState("");
  const [aiMode, setAiMode] = useState<"slides" | "repurpose" | "hooks">("slides");

  // Version history state
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [versionHistory, setVersionHistory] = useState<{ date: string; copy: string }[]>([]);

  useEffect(() => {
    if (!cardId) return;
    const found =
      getCardById(cardId) ||
      cards.find((c) => c.id === cardId || c.id === decodeURIComponent(cardId));
    if (found) {
      setCard(found);
    }
  }, [cardId, cards, getCardById]);

  // Load version history from localStorage
  useEffect(() => {
    if (!cardId) return;
    try {
      const historyKey = `card_history_${cardId}`;
      const saved = localStorage.getItem(historyKey);
      if (saved) {
        setVersionHistory(JSON.parse(saved));
      }
    } catch (e) {}
  }, [cardId]);

  if (!card) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-6 h-6 border-2 border-[#FF5A1F] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 text-sm">Loading card...</p>
          <Link
            href="/content"
            className="text-[#FF5A1F] font-semibold text-xs hover:underline block pt-2"
          >
            &larr; Back to Board
          </Link>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    if (!card) return;
    updateCard(card);
    setIsSavedMessage(true);

    // Save snapshot in version history
    try {
      const historyKey = `card_history_${card.id}`;
      const newSnapshot = {
        date: new Date().toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
        copy: card.slideCopy || "",
      };
      const updatedHistory = [newSnapshot, ...versionHistory.slice(0, 9)];
      setVersionHistory(updatedHistory);
      localStorage.setItem(historyKey, JSON.stringify(updatedHistory));
    } catch (e) {}

    setTimeout(() => setIsSavedMessage(false), 2000);
  };

  const handleRunAi = async (mode: "slides" | "repurpose" | "hooks") => {
    setAiMode(mode);
    setIsAiLoading(true);
    setIsAiModalOpen(true);
    setAiOutput("");

    try {
      const actionMap = {
        slides: "generate_slides",
        repurpose: "repurpose",
        hooks: "suggest_hooks",
      };

      const res = await fetch("/studio/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: actionMap[mode],
          title: card.title,
          category: card.category,
          slideCopy: card.slideCopy,
          type: card.type,
        }),
      });

      const data = await res.json();
      if (data.success && data.text) {
        setAiOutput(data.text);
      } else {
        setAiOutput("Failed to generate content. Please try again.");
      }
    } catch (err) {
      setAiOutput("Network error while connecting to AI generator.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const applyAiToCard = () => {
    if (!aiOutput || !card) return;
    if (aiMode === "slides") {
      setCard({ ...card, slideCopy: aiOutput });
    } else if (aiMode === "hooks") {
      setCard({ ...card, caption: (card.caption ? card.caption + "\n\n" : "") + "Hook Options:\n" + aiOutput });
    } else {
      setCard({
        ...card,
        caption: (card.caption ? card.caption + "\n\n" : "") + aiOutput,
      });
    }
    setIsAiModalOpen(false);
    handleSave();
  };

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="min-h-screen pb-16">
      <Header />

      <main className="px-4 sm:px-6 md:px-8 max-w-[1440px] mx-auto space-y-4 sm:space-y-5">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between gap-2 pt-2">
          {/* Left Actions: Back button + Saved + History */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/content"
              className="bg-white hover:bg-gray-50 active:scale-95 border border-gray-200/80 rounded-xl px-3 py-1.5 text-[12.5px] font-medium text-gray-700 flex items-center gap-1.5 shadow-xs transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Link>

            <span className="text-[12px] font-medium text-gray-400">
              {isSavedMessage ? (
                <span className="text-emerald-600 font-semibold animate-pulse">✓ Saved to Cloud</span>
              ) : (
                "Cloud Synced"
              )}
            </span>

            <button
              onClick={() => setIsHistoryOpen(true)}
              className="hidden sm:inline-flex bg-white hover:bg-gray-50 border border-gray-200/80 rounded-xl px-3 py-1 text-[12px] font-medium text-gray-700 shadow-xs transition-all items-center gap-1 cursor-pointer"
            >
              <History className="w-3.5 h-3.5 text-gray-400" />
              <span>Version history ({versionHistory.length})</span>
            </button>
          </div>

          {/* Right Actions: AI Generate, Repurpose, Save */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleRunAi("slides")}
              className="bg-white hover:bg-orange-50/70 border border-orange-200 rounded-xl px-3 py-1.5 text-[12px] font-semibold text-[#FF5A1F] flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FF5A1F]" />
              <span>AI Copilot</span>
            </button>

            <button
              onClick={() => handleRunAi("repurpose")}
              className="bg-white hover:bg-gray-50 border border-gray-200/80 rounded-xl px-3 py-1.5 text-[12px] font-semibold text-gray-700 flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5 text-gray-500" />
              <span>Repurpose</span>
            </button>

            <button
              onClick={handleSave}
              className="bg-[#FF5A1F] hover:bg-[#E84C12] active:scale-95 text-white rounded-xl px-4 py-1.5 text-[13px] font-semibold flex items-center gap-1.5 shadow-[0_2px_8px_rgba(255,90,31,0.3)] transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
          </div>
        </div>

        {/* 2-Column Main Layout: Main Form (Left) & Sidebar (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 items-start">
          {/* LEFT 2-COLUMNS: MAIN EDIT FORM */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-5">
            {/* 1. Header Card: Title & Meta Dropdowns */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 shadow-xs space-y-4">
              <input
                type="text"
                value={card.title}
                onChange={(e) => setCard({ ...card, title: e.target.value })}
                className="w-full text-xl sm:text-[24px] font-extrabold text-[#1A1A1A] outline-none border-b border-transparent focus:border-gray-200 pb-1 tracking-tight"
                placeholder="Title..."
              />

              {/* Meta dropdowns row */}
              <div className="flex items-center gap-2.5 flex-wrap">
                {/* Content Type */}
                <div className="relative">
                  <select
                    value={card.type}
                    onChange={(e) => setCard({ ...card, type: e.target.value })}
                    className="appearance-none bg-gray-50/80 border border-gray-200/80 rounded-xl pl-3 pr-7 py-1.5 text-[12.5px] font-medium text-gray-700 outline-none hover:bg-gray-100 cursor-pointer shadow-xs"
                  >
                    <option value="IG Carousel">🎴 IG Carousel</option>
                    <option value="IG Reel · Standard">🎬 IG Reel · Standard</option>
                    <option value="IG B-roll · Trial">🎞️ IG B-roll · Trial</option>
                    <option value="LinkedIn">💼 LinkedIn</option>
                    <option value="X / Twitter">𝕏 X / Twitter</option>
                    <option value="YouTube Long">▶️ YouTube Long</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Status */}
                <div className="relative">
                  <select
                    value={card.status}
                    onChange={(e) => setCard({ ...card, status: e.target.value })}
                    className="appearance-none bg-gray-50/80 border border-gray-200/80 rounded-xl pl-3 pr-7 py-1.5 text-[12.5px] font-medium text-gray-700 outline-none hover:bg-gray-100 cursor-pointer shadow-xs"
                  >
                    <option value="Idea">Idea</option>
                    <option value="Scripting">Scripting</option>
                    <option value="Filming (Approved)">Filming (Approved)</option>
                    <option value="In Editing">In Editing</option>
                    <option value="For Review">For Review</option>
                    <option value="Requires Revision">Requires Revision</option>
                    <option value="Approved">Approved</option>
                    <option value="Posted">Posted</option>
                    <option value="Dismissed">Dismissed</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Priority */}
                <div className="relative">
                  <select
                    value={card.priority || "Medium"}
                    onChange={(e) => setCard({ ...card, priority: e.target.value })}
                    className="appearance-none bg-gray-50/80 border border-gray-200/80 rounded-xl pl-3 pr-7 py-1.5 text-[12.5px] font-medium text-gray-700 outline-none hover:bg-gray-100 cursor-pointer shadow-xs"
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Category */}
                <div className="relative">
                  <select
                    value={card.category || "Mindset & Philosophy"}
                    onChange={(e) => setCard({ ...card, category: e.target.value })}
                    className="appearance-none bg-gray-50/80 border border-gray-200/80 rounded-xl pl-3 pr-7 py-1.5 text-[12.5px] font-medium text-gray-700 outline-none hover:bg-gray-100 cursor-pointer shadow-xs"
                  >
                    <option value="Mindset & Philosophy">Mindset & Philosophy</option>
                    <option value="Productivity Systems">Productivity Systems</option>
                    <option value="Cognitive Reframing">Cognitive Reframing</option>
                    <option value="AI News">AI News</option>
                    <option value="Sales/Conversion">Sales/Conversion</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* 2. Copy Card: SLIDE-BY-SLIDE COPY */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">
                    COPY
                  </span>
                  <span className="block text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">
                    SLIDE-BY-SLIDE COPY
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(card.slideCopy || "", "copy")}
                    className="text-gray-400 hover:text-gray-600 text-[11px] font-medium flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-200 transition-colors"
                  >
                    {copiedSection === "copy" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSection === "copy" ? "Copied" : "Copy"}</span>
                  </button>

                  <button
                    onClick={() => handleRunAi("slides")}
                    className="text-[#FF5A1F] hover:text-[#E84C12] text-[11.5px] font-semibold flex items-center gap-1 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200 transition-colors"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Rewrite with AI</span>
                  </button>
                </div>
              </div>

              <textarea
                rows={11}
                value={card.slideCopy || ""}
                onChange={(e) => setCard({ ...card, slideCopy: e.target.value })}
                placeholder="Slide 1 (cover): ...&#10;Slide 2: ..."
                className="w-full bg-gray-50/40 border border-gray-200/70 rounded-xl p-3.5 text-[13px] text-gray-800 outline-none focus:border-gray-400 font-mono leading-relaxed"
              />
            </div>

            {/* 3. Details Card: Number of slides, Caption, Hashtags */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs space-y-4">
              <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                DETAILS & SOCIAL POST
              </span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                    Number of Slides
                  </label>
                  <input
                    type="number"
                    value={card.slidesCount || 8}
                    onChange={(e) =>
                      setCard({ ...card, slidesCount: parseInt(e.target.value) || 0 })
                    }
                    className="w-full bg-gray-50/70 border border-gray-200/80 rounded-xl px-3 py-1.5 text-[13px] text-gray-800 outline-none focus:border-gray-300"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                    Hashtags
                  </label>
                  <input
                    type="text"
                    value={card.hashtags || ""}
                    onChange={(e) => setCard({ ...card, hashtags: e.target.value })}
                    placeholder="#RewriteMinds #MentalModels #Stoicism"
                    className="w-full bg-gray-50/70 border border-gray-200/80 rounded-xl px-3 py-1.5 text-[13px] text-gray-800 outline-none focus:border-gray-300"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-semibold text-gray-500">
                    Caption
                  </label>
                  <button
                    onClick={() => handleRunAi("hooks")}
                    className="text-[11px] font-medium text-[#FF5A1F] hover:underline"
                  >
                    + Suggest Hooks
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={card.caption || ""}
                  onChange={(e) => setCard({ ...card, caption: e.target.value })}
                  placeholder="Post caption and comment funnel keywords..."
                  className="w-full bg-gray-50/70 border border-gray-200/80 rounded-xl p-3 text-[13px] text-gray-800 outline-none focus:border-gray-300 leading-relaxed"
                />
              </div>
            </div>

            {/* 4. Assets Card: URLs Grid */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs space-y-4">
              <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                ASSETS & DELIVERABLES
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                    Brief / Source Notion Link
                  </label>
                  <input
                    type="url"
                    value={card.briefUrl || ""}
                    onChange={(e) => setCard({ ...card, briefUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-gray-50/70 border border-gray-200/80 rounded-xl px-3 py-1.5 text-[12px] text-gray-800 outline-none focus:border-gray-300 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                    Final Export / Drive Link
                  </label>
                  <input
                    type="url"
                    value={card.finalFilesUrl || ""}
                    onChange={(e) => setCard({ ...card, finalFilesUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-gray-50/70 border border-gray-200/80 rounded-xl px-3 py-1.5 text-[12px] text-gray-800 outline-none focus:border-gray-300 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                    Cover Slide Image URL
                  </label>
                  <input
                    type="url"
                    value={card.coverImageUrl || ""}
                    onChange={(e) => setCard({ ...card, coverImageUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-gray-50/70 border border-gray-200/80 rounded-xl px-3 py-1.5 text-[12px] text-gray-800 outline-none focus:border-gray-300 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                    Live Published URL (Instagram / X)
                  </label>
                  <input
                    type="url"
                    value={card.postedUrl || ""}
                    onChange={(e) => setCard({ ...card, postedUrl: e.target.value })}
                    placeholder="https://instagram.com/p/..."
                    className="w-full bg-gray-50/70 border border-gray-200/80 rounded-xl px-3 py-1.5 text-[12px] text-gray-800 outline-none focus:border-gray-300 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT 1-COLUMN: SIDEBAR PANELS */}
          <div className="space-y-5">
            {/* Panel 1: ASSIGNED TEAM */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs space-y-4">
              <span className="block text-[10.5px] font-bold text-gray-400 uppercase tracking-widest">
                ASSIGNED TEAM
              </span>

              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    CREATOR / OWNER
                  </label>
                  <div className="relative">
                    <select
                      value={card.owner || "Muzammil"}
                      onChange={(e) => setCard({ ...card, owner: e.target.value })}
                      className="w-full appearance-none bg-gray-50/80 border border-gray-200/80 rounded-xl px-3 py-2 text-[12.5px] font-medium text-gray-700 outline-none"
                    >
                      <option value="Muzammil">Muzammil</option>
                      <option value="Unassigned">Unassigned</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    PRIMARY WRITER
                  </label>
                  <div className="relative">
                    <select
                      value={card.writer || "Muzammil"}
                      onChange={(e) => setCard({ ...card, writer: e.target.value })}
                      className="w-full appearance-none bg-gray-50/80 border border-gray-200/80 rounded-xl px-3 py-2 text-[12.5px] font-medium text-gray-700 outline-none"
                    >
                      <option value="Muzammil">Muzammil</option>
                      <option value="Unassigned">Unassigned</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Panel 2: SCHEDULE */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs space-y-4">
              <span className="block text-[10.5px] font-bold text-gray-400 uppercase tracking-widest">
                SCHEDULE & DEADLINES
              </span>

              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    EDITORIAL DUE DATE
                  </label>
                  <input
                    type="date"
                    value={card.dueDate || ""}
                    onChange={(e) => setCard({ ...card, dueDate: e.target.value })}
                    className="w-full bg-gray-50/80 border border-gray-200/80 rounded-xl px-3 py-2 text-[12.5px] font-medium text-gray-700 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    CONFIRMED PUBLISH DATE
                  </label>
                  <input
                    type="date"
                    value={card.postedAt || ""}
                    onChange={(e) => setCard({ ...card, postedAt: e.target.value })}
                    className="w-full bg-gray-50/80 border border-gray-200/80 rounded-xl px-3 py-2 text-[12.5px] font-medium text-gray-700 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    TOPIC TAGS
                  </label>
                  <input
                    type="text"
                    placeholder="mindset, psychology, stoicism"
                    value={card.tags || ""}
                    onChange={(e) => setCard({ ...card, tags: e.target.value })}
                    className="w-full bg-gray-50/80 border border-gray-200/80 rounded-xl px-3 py-2 text-[12.5px] font-medium text-gray-700 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Panel 3: ACTIVITY HISTORY */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs space-y-3">
              <span className="block text-[10.5px] font-bold text-gray-400 uppercase tracking-widest">
                ACTIVITY & AUDIT LOG
              </span>
              <div className="space-y-2.5 pt-1">
                {(card.activityLog && card.activityLog.length > 0 ? card.activityLog : [
                  { text: `Created as ${card.type} in ${card.status}`, time: "Initial import" },
                ]).map((act, idx) => (
                  <div key={idx} className="text-[12px] space-y-0.5">
                    <p className="text-gray-800 font-medium">{act.text}</p>
                    <span className="text-[11px] text-gray-400">{act.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ========================================================= */}
      {/* AI COPILOT MODAL                                          */}
      {/* ========================================================= */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-2xl w-full p-6 relative max-h-[85vh] flex flex-col">
            <button
              onClick={() => setIsAiModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#FF5A1F] flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  {aiMode === "slides"
                    ? "Rewrite Minds Slide Architect"
                    : aiMode === "repurpose"
                    ? "Multi-Channel Repurposing Engine"
                    : "High-CTR Hook Generator"}
                </h3>
                <p className="text-xs text-gray-500">
                  Generating output for: &ldquo;{card.title}&rdquo;
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-gray-50/70 border border-gray-200/80 rounded-xl my-2">
              {isAiLoading ? (
                <div className="py-16 text-center space-y-3">
                  <div className="w-7 h-7 border-2 border-[#FF5A1F] border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-gray-500 font-medium">
                    Structuring cognitive breakdown with Rewrite Minds models...
                  </p>
                </div>
              ) : (
                <pre className="text-xs text-gray-800 font-mono whitespace-pre-wrap leading-relaxed">
                  {aiOutput}
                </pre>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => copyToClipboard(aiOutput, "ai")}
                disabled={isAiLoading || !aiOutput}
                className="px-3.5 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center gap-1.5 transition-colors"
              >
                {copiedSection === "ai" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === "ai" ? "Copied" : "Copy to Clipboard"}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAiModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={applyAiToCard}
                  disabled={isAiLoading || !aiOutput}
                  className="px-4 py-2 text-xs font-semibold bg-[#FF5A1F] hover:bg-[#E84C12] text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Apply to Card</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VERSION HISTORY DRAWER                                    */}
      {/* ========================================================= */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md h-full p-6 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-[#FF5A1F]" />
                  <h3 className="text-base font-bold text-gray-900">Version History</h3>
                </div>
                <button
                  onClick={() => setIsHistoryOpen(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 overflow-y-auto max-h-[70vh]">
                {versionHistory.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-12">
                    No previous versions saved yet. Every time you click &ldquo;Save&rdquo;, a snapshot is created here.
                  </p>
                ) : (
                  versionHistory.map((snap, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-gray-200/80 bg-gray-50/50 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11.5px] font-bold text-gray-700">
                          {snap.date}
                        </span>
                        <button
                          onClick={() => {
                            setCard({ ...card, slideCopy: snap.copy });
                            setIsHistoryOpen(false);
                            setIsSavedMessage(true);
                            setTimeout(() => setIsSavedMessage(false), 2000);
                          }}
                          className="text-[11px] font-semibold text-[#FF5A1F] hover:underline"
                        >
                          Restore
                        </button>
                      </div>
                      <p className="text-[11px] font-mono text-gray-500 line-clamp-3 bg-white p-2 rounded-lg border border-gray-100">
                        {snap.copy || "Empty copy"}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <button
              onClick={() => setIsHistoryOpen(false)}
              className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl"
            >
              Close History
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
