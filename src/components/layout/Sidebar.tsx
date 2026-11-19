"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  SlidersHorizontal,
  CheckSquare,
  Calendar,
  TrendingUp,
  Clock,
  Settings,
  Plus,
} from "lucide-react";
import { useContent } from "@/context/ContentContext";

export function Sidebar() {
  const pathname = usePathname();
  const { setIsCreateModalOpen } = useContent();

  const isHomeActive = pathname === "/home" || pathname === "/";
  const isContentActive = pathname.startsWith("/content");
  const isTasksActive = pathname.startsWith("/tasks");
  const isCalendarActive = pathname.startsWith("/calendar");
  const isDiscoverActive = pathname.startsWith("/discover");
  const isInsightsActive = pathname.startsWith("/insights");
  const isSettingsActive = pathname.startsWith("/settings");

  return (
    <aside className="hidden md:flex fixed top-4 left-4 bottom-4 w-[240px] z-40 bg-white rounded-3xl border border-gray-100/90 shadow-sidebar flex-col justify-between p-4 select-none">
      {/* Top Header & Brand */}
      <div>
        <div className="flex items-center gap-3 px-2 py-1 mb-5">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-900 border border-zinc-700 flex-shrink-0 flex items-center justify-center text-white font-semibold text-sm">
            {/* User Avatar */}
            <img
              src="/avatar.jpg"
              alt="Muzammil"
              className="w-full h-full object-cover object-top"
            />
            <span className="hidden">RM</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-[14px] font-bold text-[#1A1A1A] leading-tight">
              Content OS
            </h1>
            <span className="text-[10px] font-semibold text-gray-400 tracking-wider uppercase">
              REWRITEMINDS
            </span>
          </div>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="w-full bg-[#FF5A1F] hover:bg-[#E84C12] active:scale-[0.98] transition-all text-white font-semibold text-[13.5px] py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-[0_2px_8px_rgba(255,90,31,0.25)] mb-6 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Create content</span>
        </button>

        {/* Workspace Nav Section */}
        <div className="space-y-1">
          <div className="px-3 pb-2 text-[10.5px] font-bold text-gray-400 tracking-wider uppercase">
            WORKSPACE
          </div>

          <Link
            href="/home"
            className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-[13.5px] font-medium transition-all ${
              isHomeActive
                ? "bg-[#FF5A1F] text-white shadow-xs font-semibold"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/80"
            }`}
          >
            <LayoutGrid className={`w-4 h-4 ${isHomeActive ? "text-white" : "text-gray-500"}`} />
            <span>Home</span>
          </Link>

          <Link
            href="/content"
            className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-[13.5px] font-medium transition-all ${
              isContentActive
                ? "bg-[#FF5A1F] text-white shadow-xs font-semibold"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/80"
            }`}
          >
            <SlidersHorizontal className={`w-4 h-4 ${isContentActive ? "text-white" : "text-gray-500"}`} />
            <span>Content</span>
          </Link>

          <Link
            href="/tasks"
            className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-[13.5px] font-medium transition-all ${
              isTasksActive
                ? "bg-[#FF5A1F] text-white shadow-xs font-semibold"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/80"
            }`}
          >
            <CheckSquare className={`w-4 h-4 ${isTasksActive ? "text-white" : "text-gray-500"}`} />
            <span>Tasks</span>
          </Link>

          <Link
            href="/calendar"
            className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-[13.5px] font-medium transition-all ${
              isCalendarActive
                ? "bg-[#FF5A1F] text-white shadow-xs font-semibold"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/80"
            }`}
          >
            <Calendar className={`w-4 h-4 ${isCalendarActive ? "text-white" : "text-gray-500"}`} />
            <span>Calendar</span>
          </Link>

          <Link
            href="/discover"
            className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-[13.5px] font-medium transition-all ${
              isDiscoverActive
                ? "bg-[#FF5A1F] text-white shadow-xs font-semibold"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/80"
            }`}
          >
            <TrendingUp className={`w-4 h-4 ${isDiscoverActive ? "text-white" : "text-gray-500"}`} />
            <span>Discover (Radar)</span>
          </Link>

          <Link
            href="/insights"
            className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-[13.5px] font-medium transition-all ${
              isInsightsActive
                ? "bg-[#FF5A1F] text-white shadow-xs font-semibold"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/80"
            }`}
          >
            <Clock className={`w-4 h-4 ${isInsightsActive ? "text-white" : "text-gray-500"}`} />
            <span>Insights</span>
          </Link>
        </div>
      </div>

      {/* Bottom Settings Link */}
      <div className="pt-2 border-t border-gray-100/80">
        <Link
          href="/settings"
          className={`flex items-center gap-3 px-3 py-2 rounded-xl text-[13.5px] font-medium transition-all ${
            isSettingsActive
              ? "bg-[#FF5A1F] text-white shadow-xs font-semibold"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          <Settings className={`w-4 h-4 ${isSettingsActive ? "text-white" : "text-gray-500"}`} />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
}
