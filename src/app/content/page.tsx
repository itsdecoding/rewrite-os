"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  ChevronDown,
  Plus,
  ExternalLink,
  Trash2,
  ListFilter,
  SlidersHorizontal,
  Calendar,
  Layers,
  Sparkles,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { useContent } from "@/context/ContentContext";
import { COLUMNS, ContentCard } from "@/data/mockData";

export default function ContentBoardPage() {
  const {
    cards,
    updateCardStatus,
    deleteCard,
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
    uniqueWriters,
    uniqueCategories,
  } = useContent();

  const [activeColumnTab, setActiveColumnTab] = useState<string>("Idea");
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);

  // Filter cards based on active filter, category, search query, and writer
  const filteredCards = cards.filter((card) => {
    // Filter by Platform / Type
    if (activeFilter !== "All" && activeFilter !== "All Types") {
      if (activeFilter === "IG Reel" && !card.type.includes("IG Reel")) return false;
      if (activeFilter === "IG B-roll" && !card.type.includes("IG B-roll")) return false;
      if (activeFilter === "IG Carousel" && !card.type.includes("IG Carousel")) return false;
      if (activeFilter === "LinkedIn" && !card.type.includes("LinkedIn")) return false;
      if (activeFilter === "X / Twitter" && !card.type.includes("X / Twitter")) return false;
      if (activeFilter === "YouTube Long" && !card.type.includes("YouTube Long")) return false;
      if (!card.type.toLowerCase().includes(activeFilter.toLowerCase())) return false;
    }

    // Filter by Category
    if (activeCategory !== "All Categories") {
      if ((card.category || "") !== activeCategory) return false;
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchTitle = card.title.toLowerCase().includes(q);
      const matchCategory = (card.category || "").toLowerCase().includes(q);
      const matchTags = (card.tags || "").toLowerCase().includes(q);
      const matchWriter = (card.writer || "").toLowerCase().includes(q);
      if (!matchTitle && !matchCategory && !matchTags && !matchWriter) return false;
    }

    // Filter by writer
    if (selectedWriter !== "All Writers") {
      if (card.writer !== selectedWriter && card.owner !== selectedWriter) return false;
    }

    return true;
  });

  // Drag and drop handlers for desktop view
  const handleDragStart = (cardId: string) => {
    setDraggedCardId(cardId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (columnId: string) => {
    if (draggedCardId) {
      updateCardStatus(draggedCardId, columnId);
      setDraggedCardId(null);
    }
  };

  // Cards for mobile column view
  const mobileColumnCards = filteredCards.filter((c) => c.status === activeColumnTab);

  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-8">
      {/* Top Header */}
      <Header showBoardFilters={true} />

      {/* ========================================================= */}
      {/* MOBILE VIEW (RESPONSIVE FEED / LIST)                      */}
      {/* ========================================================= */}
      <main className="md:hidden flex-1 px-4 pt-3 flex flex-col">
        {/* Workflow Title */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="block text-[11px] font-bold text-gray-400 tracking-[0.16em] uppercase mb-0.5">
              WORKFLOW
            </span>
            <h1 className="text-[28px] font-extrabold text-[#1A1A1A] tracking-tight leading-none">
              {viewMode === "Board" ? "Board" : "List"}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[12px] font-semibold text-gray-400">
              {filteredCards.length} items
            </span>
          </div>
        </div>

        {/* Row 1: [ Board | List ] Segmented Toggle & Search input */}
        <div className="flex items-center gap-2.5 mb-3">
          <div className="flex bg-[#ECEAE5]/80 p-1 rounded-xl shrink-0">
            <button
              type="button"
              onClick={() => setViewMode("Board")}
              className={`text-[13px] font-semibold px-3 py-1 rounded-lg transition-all ${
                viewMode === "Board"
                  ? "bg-white text-gray-900 shadow-xs"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Board
            </button>
            <button
              type="button"
              onClick={() => setViewMode("List")}
              className={`text-[13px] font-medium px-3 py-1 rounded-lg transition-all ${
                viewMode === "List"
                  ? "bg-white text-gray-900 shadow-xs font-semibold"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              List
            </button>
          </div>

          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="mobile-card-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cards..."
              className="w-full bg-white border border-gray-200/90 rounded-2xl pl-9 pr-3.5 py-2 text-[13px] text-gray-800 placeholder-gray-400 shadow-xs outline-none focus:border-gray-400"
            />
          </div>
        </div>

        {/* Row 2: Dropdowns (Content Type & Writers) */}
        <div className="grid grid-cols-2 gap-2.5 mb-3">
          <div className="relative">
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-200/90 rounded-2xl px-3.5 py-2 text-[13px] font-medium text-gray-800 outline-none shadow-xs pr-8 cursor-pointer"
            >
              <option value="All">All Types</option>
              <option value="IG Carousel">IG Carousel</option>
              <option value="IG Reel">IG Reel · Standard</option>
              <option value="IG B-roll">IG B-roll · Trial</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="X / Twitter">X / Twitter</option>
              <option value="YouTube Long">YouTube Long</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-200/90 rounded-2xl px-3.5 py-2 text-[13px] font-medium text-gray-800 outline-none shadow-xs pr-8 cursor-pointer"
            >
              <option value="All Categories">All Categories</option>
              {uniqueCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Row 3: + New Button */}
        <div className="mb-4">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full sm:w-auto bg-[#FF5A1F] hover:bg-[#E84C12] active:scale-95 text-white font-bold text-[13.5px] px-5 py-2.5 rounded-2xl flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Create new card</span>
          </button>
        </div>

        {/* Mode: Board Mobile or List Mobile */}
        {viewMode === "Board" ? (
          <>
            {/* Horizontal Column Tabs Bar (Idea (10), Scripting (5), etc.) */}
            <div className="w-full border-t border-b border-[#ECEAE5] py-2.5 overflow-x-auto no-scrollbar flex items-center gap-2 mb-4">
              {COLUMNS.map((col) => {
                const count = filteredCards.filter((c) => c.status === col.id).length;
                const isActive = activeColumnTab === col.id;

                return (
                  <button
                    key={col.id}
                    onClick={() => setActiveColumnTab(col.id)}
                    className={`flex items-center gap-2 text-[12.5px] shrink-0 rounded-xl transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#ECEAE5] text-[#1A1A1A] font-bold px-3.5 py-1.5 shadow-xs"
                        : "text-gray-600 font-medium px-2.5 py-1.5 hover:bg-[#ECEAE5]/40"
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: col.colorDot }}
                    />
                    <span>{col.title}</span>
                    <span
                      className={`text-[12px] ${
                        isActive ? "text-gray-600 font-semibold" : "text-gray-400"
                      }`}
                    >
                      ({count})
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Cards Feed for Active Column */}
            <div className="space-y-3 pb-8 flex-1">
              {mobileColumnCards.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="text-gray-400 text-sm font-medium">
                    No cards in {activeColumnTab}
                  </p>
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="mt-2 text-xs font-semibold text-[#FF5A1F]"
                  >
                    + Add a card here
                  </button>
                </div>
              ) : (
                mobileColumnCards.map((card) => (
                  <div
                    key={card.id}
                    className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-sm hover:shadow-md transition-all space-y-3 relative group"
                  >
                    {/* Badges Row */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-[#FDF2F8] text-[#BE185D] text-[11px] font-semibold px-2.5 py-0.5 rounded-lg flex items-center gap-1.5">
                        <span>🎴</span>
                        <span>{card.type}</span>
                      </span>

                      {card.category && (
                        <span className="bg-[#EFF6FF] text-[#1E40AF] text-[11px] font-semibold px-2.5 py-0.5 rounded-lg">
                          {card.category}
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm("Delete this card?")) {
                            deleteCard(card.id);
                          }
                        }}
                        className="ml-auto text-gray-400 hover:text-red-500 p-1 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Title */}
                    <Link href={`/content/${card.id}`} className="block">
                      <h3 className="text-[14.5px] font-bold text-[#1A1A1A] leading-snug line-clamp-3 hover:text-[#FF5A1F] transition-colors">
                        {card.title}
                      </h3>
                    </Link>

                    {/* Bottom Row */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-gray-400 font-medium">
                        {card.dueDate || "No due date"}
                      </span>
                      <div className="relative">
                        <select
                          value={card.status}
                          onChange={(e) => updateCardStatus(card.id, e.target.value)}
                          className="appearance-none bg-white border border-gray-200 rounded-xl pl-3 pr-7 py-1 text-[12px] font-medium text-gray-700 outline-none shadow-xs hover:bg-gray-50 cursor-pointer"
                        >
                          {COLUMNS.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.title}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          /* Mobile List View */
          <div className="space-y-2.5 pb-8 flex-1">
            {filteredCards.length === 0 ? (
              <div className="py-16 text-center text-gray-400 text-sm">
                No cards match your filter criteria.
              </div>
            ) : (
              filteredCards.map((card) => (
                <div
                  key={card.id}
                  className="bg-white rounded-xl border border-gray-200/80 p-3.5 shadow-xs flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold text-gray-500 flex items-center gap-1">
                      <span>🎴</span>
                      <span>{card.type}</span>
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                      {card.status}
                    </span>
                  </div>

                  <Link
                    href={`/content/${card.id}`}
                    className="text-[13.5px] font-bold text-[#1A1A1A] hover:text-[#FF5A1F] leading-snug"
                  >
                    {card.title}
                  </Link>

                  <div className="flex items-center justify-between pt-1 text-[11.5px] text-gray-400 border-t border-gray-50">
                    <span>{card.category || "General"}</span>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/content/${card.id}`}
                        className="text-[#FF5A1F] font-semibold flex items-center gap-0.5"
                      >
                        Edit &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* DESKTOP VIEW: KANBAN BOARD OR HIGH-EFFICIENCY LIST VIEW   */}
      {/* ========================================================= */}
      <main className="hidden md:flex flex-1 px-8 pb-8 overflow-x-auto">
        {viewMode === "Board" ? (
          /* Desktop Kanban Board */
          <div className="flex gap-4 min-w-max pb-4 items-start">
            {COLUMNS.map((col) => {
              const columnCards = filteredCards.filter((c) => c.status === col.id);

              return (
                <div
                  key={col.id}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(col.id)}
                  className="w-[285px] flex-shrink-0 flex flex-col bg-gray-100/60 border border-gray-200/50 rounded-2xl p-2.5 transition-colors"
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between px-2 py-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: col.colorDot }}
                      />
                      <h3
                        className={`text-[13px] font-bold ${
                          col.isOrange
                            ? "text-[#FF5A1F]"
                            : col.isYellow
                            ? "text-[#B47D14]"
                            : col.isRed
                            ? "text-[#DC2626]"
                            : col.isGreen || col.isMint
                            ? "text-[#10B981]"
                            : "text-gray-700"
                        }`}
                      >
                        {col.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[11.5px] font-semibold px-2 py-0.5 rounded-full bg-white text-gray-500 shadow-xs border border-gray-100">
                        {columnCards.length}
                      </span>
                      <button
                        onClick={() => setIsCreateModalOpen(true)}
                        title={`Add card to ${col.title}`}
                        className="text-gray-400 hover:text-gray-700 p-1 rounded-md hover:bg-white transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Cards List or Drop Here Placeholder */}
                  <div className="space-y-3 min-h-[350px] flex flex-col">
                    {columnCards.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-gray-200 rounded-xl my-1">
                        <span className="text-[12px] font-medium text-gray-400 select-none">
                          Drop card here
                        </span>
                        <button
                          onClick={() => setIsCreateModalOpen(true)}
                          className="mt-1 text-[11px] font-semibold text-[#FF5A1F] hover:underline"
                        >
                          + New card
                        </button>
                      </div>
                    ) : (
                      columnCards.map((card) => (
                        <div
                          key={card.id}
                          draggable
                          onDragStart={() => handleDragStart(card.id)}
                          className="bg-white rounded-xl border border-gray-200/70 p-3.5 shadow-xs hover:shadow-md transition-all space-y-3 select-none group relative"
                        >
                          <div className="flex items-center justify-between gap-1.5">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-md bg-[#FDF2F8] text-[#BE185D] flex items-center gap-1">
                                <span className="text-[10px]">🎴</span>
                                {card.type}
                              </span>

                              {card.category && (
                                <span className="text-[10.5px] font-medium px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
                                  {card.category}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Link
                                href={`/content/${card.id}`}
                                className="text-gray-400 hover:text-[#FF5A1F] p-1 rounded-lg hover:bg-orange-50 transition-colors"
                                title="Open card"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </Link>
                              <button
                                type="button"
                                title="Delete card"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (confirm("Delete this card?")) {
                                    deleteCard(card.id);
                                  }
                                }}
                                className="text-gray-400 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <Link href={`/content/${card.id}`} className="block">
                            <h4 className="text-[13.5px] font-bold text-[#1A1A1A] hover:text-[#FF5A1F] transition-colors leading-snug line-clamp-3">
                              {card.title}
                            </h4>
                          </Link>

                          <div
                            className="flex items-center justify-between pt-1 border-t border-gray-50 text-[11.5px]"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className="text-gray-400 font-medium">
                              {card.dueDate ? card.dueDate : "No due date"}
                            </span>

                            <div className="relative">
                              <select
                                value={card.status}
                                onChange={(e) => updateCardStatus(card.id, e.target.value)}
                                className="appearance-none bg-gray-50 hover:bg-gray-100 border border-gray-200/80 rounded-lg pl-2 pr-6 py-1 text-[11.5px] font-medium text-gray-700 outline-none cursor-pointer transition-colors"
                              >
                                {COLUMNS.map((c) => (
                                  <option key={c.id} value={c.id}>
                                    {c.title}
                                  </option>
                                ))}
                              </select>
                              <ChevronDown className="w-3 h-3 text-gray-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Desktop High-Efficiency Editorial List View */
          <div className="w-full bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-200/80 bg-gray-50/80 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Title & Copy Preview</th>
                    <th className="py-3 px-4">Format</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Stage (Status)</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Writer / Owner</th>
                    <th className="py-3 px-4">Due Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-[13px]">
                  {filteredCards.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-16 text-center text-gray-400">
                        No cards match your current filters.
                      </td>
                    </tr>
                  ) : (
                    filteredCards.map((card) => {
                      const col = COLUMNS.find((c) => c.id === card.status);
                      return (
                        <tr
                          key={card.id}
                          className="hover:bg-gray-50/70 transition-colors group"
                        >
                          <td className="py-3 px-4 max-w-md">
                            <Link
                              href={`/content/${card.id}`}
                              className="font-bold text-[#1A1A1A] hover:text-[#FF5A1F] transition-colors block leading-snug line-clamp-2"
                            >
                              {card.title}
                            </Link>
                            {card.slideCopy && (
                              <p className="text-[11.5px] text-gray-400 font-mono truncate mt-0.5">
                                {card.slideCopy.slice(0, 70)}...
                              </p>
                            )}
                          </td>

                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className="text-[11.5px] font-medium px-2 py-0.5 rounded-md bg-[#FDF2F8] text-[#BE185D] inline-flex items-center gap-1">
                              <span>🎴</span>
                              {card.type}
                            </span>
                          </td>

                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className="text-[11.5px] font-medium px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
                              {card.category || "General"}
                            </span>
                          </td>

                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="relative inline-block">
                              <select
                                value={card.status}
                                onChange={(e) => updateCardStatus(card.id, e.target.value)}
                                className="appearance-none bg-white border border-gray-200 rounded-lg pl-2.5 pr-6 py-1 text-[12px] font-semibold text-gray-800 outline-none hover:bg-gray-50 cursor-pointer shadow-xs"
                              >
                                {COLUMNS.map((c) => (
                                  <option key={c.id} value={c.id}>
                                    {c.title}
                                  </option>
                                ))}
                              </select>
                              <ChevronDown className="w-3 h-3 text-gray-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                          </td>

                          <td className="py-3 px-4 whitespace-nowrap">
                            <span
                              className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                                card.priority === "High"
                                  ? "bg-red-50 text-red-600"
                                  : card.priority === "Low"
                                  ? "bg-gray-100 text-gray-600"
                                  : "bg-amber-50 text-amber-700"
                              }`}
                            >
                              {card.priority || "Medium"}
                            </span>
                          </td>

                          <td className="py-3 px-4 whitespace-nowrap text-gray-600 font-medium">
                            {card.writer || card.owner || "Muzammil"}
                          </td>

                          <td className="py-3 px-4 whitespace-nowrap text-gray-400 text-[12px]">
                            {card.dueDate || "—"}
                          </td>

                          <td className="py-3 px-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Link
                                href={`/content/${card.id}`}
                                className="text-gray-400 hover:text-[#FF5A1F] p-1.5 rounded-lg hover:bg-orange-50 transition-colors inline-block"
                                title="Edit Card"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Link>
                              <button
                                onClick={() => {
                                  if (confirm("Delete this card?")) {
                                    deleteCard(card.id);
                                  }
                                }}
                                className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                                title="Delete Card"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="p-3 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between text-[12px] text-gray-400 px-4">
              <span>Showing {filteredCards.length} of {cards.length} content items</span>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="text-[#FF5A1F] font-semibold hover:underline"
              >
                + Add another card
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}