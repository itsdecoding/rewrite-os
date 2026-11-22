"use client";

import React, { useEffect, useRef } from "react";
import { Search, ChevronDown, RefreshCw } from "lucide-react";
import { useContent } from "@/context/ContentContext";

interface HeaderProps {
  showBoardFilters?: boolean;
}

export function Header({ showBoardFilters = false }: HeaderProps) {
  const {
    activeFilter,
    setActiveFilter,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    selectedWriter,
    setSelectedWriter,
    viewMode,
    setViewMode,
    setIsCreateModalOpen,
    isDbConnected,
    isSyncing,
    uniqueWriters,
    uniqueCategories,
    refreshFromCloud,
  } = useContent();

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global Ctrl+K / Cmd+K search hotkey
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filterTabs = [
    { id: "All", label: "All" },
    { id: "IG Reel", label: "IG Reel · Standard", icon: "🎬" },
    { id: "IG B-roll", label: "IG B-roll · Trial", icon: "🎞️" },
    { id: "IG Carousel", label: "IG Carousel", icon: "🎴" },
    { id: "LinkedIn", label: "LinkedIn", icon: "💼" },
    { id: "X / Twitter", label: "X / Twitter", icon: "𝕏" },
    { id: "YouTube Long", label: "YouTube Long", icon: "▶️" },
  ];

  return (
    <div className="w-full flex flex-col items-center">
      {/* Mobile Floating Top Bar */}
      <div className="md:hidden w-full px-3.5 pt-3 pb-1">
        <div className="w-full bg-white rounded-2xl border border-gray-200/80 shadow-[0_1px_4px_rgba(0,0,0,0.02)] p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-black border border-zinc-800 flex-shrink-0">
              <img
                src="/studio/avatar.jpg"
                alt="Rewrite Minds"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src.includes("/studio/")) {
                    target.src = "/avatar.jpg";
                  }
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] font-bold text-[#1A1A1A] leading-tight">
                Content OS
              </span>
              <span className="text-[9px] uppercase font-semibold text-gray-400">
                Rewriteminds
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Cloud Status Pill */}
            <div
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                isDbConnected
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              }`}
              title={isDbConnected ? "Supabase Cloud Connected" : "Connecting..."}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isDbConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                }`}
              />
              <span>{isDbConnected ? "Cloud" : "Syncing"}</span>
            </div>

            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("mobile-card-search");
                if (el) el.focus();
              }}
              className="flex items-center gap-1.5 bg-gray-100/90 hover:bg-gray-200/80 text-gray-400 text-[12px] font-normal px-2.5 py-1 rounded-full transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-gray-400" />
              <span>Search</span>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Search Bar & Status */}
      <div className="hidden md:flex w-full items-center justify-between py-3.5 px-8 border-b border-gray-100/80 bg-white/50 backdrop-blur-md">
        <div className="flex items-center gap-2">
          {/* Supabase Realtime indicator */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${
              isDbConnected
                ? "bg-emerald-50/80 text-emerald-700 border-emerald-200"
                : "bg-amber-50/80 text-amber-700 border-amber-200"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isDbConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
              }`}
            />
            <span>{isDbConnected ? "Supabase Live" : "Connecting..."}</span>
          </div>

          <button
            onClick={() => refreshFromCloud()}
            disabled={isSyncing}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            title="Force refresh from Supabase"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-[#FF5A1F]" : ""}`} />
          </button>
        </div>

        {/* Center Search Input */}
        <div className="relative w-full max-w-[460px]">
          <div className="flex items-center w-full bg-white border border-gray-200/80 shadow-xs rounded-full px-3.5 py-1.5 text-sm transition-all focus-within:border-gray-400 focus-within:shadow-sm">
            <Search className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cards, topics, tags..."
              className="w-full bg-transparent border-none outline-none text-[13px] text-gray-800 placeholder-gray-400"
            />
            <div className="flex flex-shrink-0 ml-2 items-center bg-gray-100 text-gray-400 text-[10.5px] font-semibold px-1.5 py-0.5 rounded border border-gray-200">
              ⌘K
            </div>
          </div>
        </div>

        {/* Right CTA */}
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-[#FF5A1F] hover:bg-[#E84C12] active:scale-[0.98] text-white font-semibold text-[13px] px-4 py-1.5 rounded-xl shadow-[0_2px_8px_rgba(255,90,31,0.25)] flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <span>+ Create</span>
        </button>
      </div>

      {/* Desktop Board / List View Sub-bar */}
      {showBoardFilters && (
        <div className="hidden md:block w-full px-8 pt-4 pb-2">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Title & View Mode Toggle */}
            <div className="flex items-center gap-3.5">
              <div>
                <span className="block text-[10.5px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">
                  WORKFLOW
                </span>
                <h1 className="text-2xl font-extrabold text-[#1A1A1A] tracking-tight leading-none">
                  {viewMode === "Board" ? "Board" : "List"}
                </h1>
              </div>

              {/* [ Board | List ] Segmented Toggle */}
              <div className="flex bg-gray-100 p-0.5 rounded-xl border border-gray-200/70 ml-2">
                <button
                  type="button"
                  onClick={() => setViewMode("Board")}
                  className={`text-[12px] font-semibold px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewMode === "Board"
                      ? "bg-white text-gray-900 shadow-xs"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <span>Board</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("List")}
                  className={`text-[12px] font-semibold px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewMode === "List"
                      ? "bg-white text-gray-900 shadow-xs"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <span>List</span>
                </button>
              </div>
            </div>

            {/* Filters Row */}
            <div className="flex items-center gap-2 flex-wrap flex-1 justify-end">
              {/* Category Dropdown */}
              <div className="relative">
                <select
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                  className="appearance-none bg-white border border-gray-200/80 rounded-xl pl-3 pr-7 py-1.5 text-[12px] font-medium text-gray-700 outline-none hover:bg-gray-50 cursor-pointer shadow-xs"
                >
                  <option value="All Categories">All Categories</option>
                  {uniqueCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  {uniqueCategories.length === 0 && (
                    <>
                      <option value="AI News">AI News</option>
                      <option value="Mindset & Philosophy">Mindset & Philosophy</option>
                    </>
                  )}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Platform Pills */}
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
                {filterTabs.map((tab) => {
                  const isActive = activeFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveFilter(tab.id)}
                      className={`text-[11.5px] font-medium px-2.5 py-1 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                        isActive
                          ? "bg-[#FFF0E8] text-[#FF5A1F] border border-[#FFD2BE] font-semibold shadow-xs"
                          : "bg-white text-gray-600 border border-gray-200/80 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      {tab.icon && <span className="text-[11px]">{tab.icon}</span>}
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Writer Dropdown */}
              <div className="relative">
                <select
                  value={selectedWriter}
                  onChange={(e) => setSelectedWriter(e.target.value)}
                  className="appearance-none bg-white border border-gray-200/80 rounded-xl pl-3 pr-7 py-1.5 text-[12px] font-medium text-gray-700 outline-none hover:bg-gray-50 cursor-pointer shadow-xs"
                >
                  <option value="All Writers">All Writers</option>
                  <option value="Muzammil">Muzammil</option>
                  {uniqueWriters
                    .filter((w) => w !== "Muzammil")
                    .map((writer) => (
                      <option key={writer} value={writer}>
                        {writer}
                      </option>
                    ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
