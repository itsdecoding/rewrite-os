"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Layers,
  Plus,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { useContent } from "@/context/ContentContext";

export default function CalendarPage() {
  const { cards, setIsCreateModalOpen } = useContent();

  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Days in month calculation
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Find cards for a given day
  const getCardsForDay = (day: number) => {
    const formattedDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return cards.filter(
      (c) => c.dueDate === formattedDate || c.postedAt === formattedDate
    );
  };

  const scheduledCards = cards.filter((c) => Boolean(c.dueDate || c.postedAt));

  return (
    <div className="min-h-screen pb-20">
      <Header />

      <main className="px-4 sm:px-6 md:px-8 max-w-[1440px] mx-auto space-y-6 pt-2">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              EDITORIAL SCHEDULE
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] tracking-tight">
              Publishing Calendar
            </h1>
            <p className="text-[13px] text-gray-500 mt-0.5">
              Track editorial milestones, filming deadlines, and publication slots.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1 shadow-xs">
              <button
                onClick={prevMonth}
                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[13px] font-bold text-gray-800 px-3 min-w-[140px] text-center">
                {monthNames[month]} {year}
              </span>
              <button
                onClick={nextMonth}
                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-[#FF5A1F] hover:bg-[#E84C12] active:scale-95 text-white font-semibold text-[13px] px-4 py-2 rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Card</span>
            </button>
          </div>
        </div>

        {/* 2-Column: Calendar Grid (Left) & Upcoming Schedule Feed (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Calendar Grid */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-200/80 shadow-xs p-5">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 text-center font-bold text-[11px] text-gray-400 uppercase tracking-wider pb-3 border-b border-gray-100">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1.5 pt-2">
              {/* Empty padding cells */}
              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={`empty-${i}`} className="min-h-[90px] p-2 bg-gray-50/40 rounded-xl" />
              ))}

              {/* Month Days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dayCards = getCardsForDay(day);
                const isToday =
                  new Date().toDateString() === new Date(year, month, day).toDateString();

                return (
                  <div
                    key={`day-${day}`}
                    className={`min-h-[95px] p-2 rounded-xl border flex flex-col justify-between transition-colors ${
                      isToday
                        ? "bg-orange-50/30 border-orange-200"
                        : "bg-white border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[12px] font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                          isToday
                            ? "bg-[#FF5A1F] text-white"
                            : "text-gray-700"
                        }`}
                      >
                        {day}
                      </span>
                    </div>

                    <div className="space-y-1 mt-1 overflow-y-auto max-h-[60px] no-scrollbar">
                      {dayCards.map((c) => (
                        <Link
                          key={c.id}
                          href={`/content/${c.id}`}
                          className="block text-[10px] font-bold p-1 rounded bg-[#FFF0E8] text-[#D9531E] hover:bg-[#FFE0D1] truncate border border-[#FFD2BE]"
                        >
                          {c.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Sidebar: Upcoming Deadlines */}
          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <CalendarIcon className="w-4 h-4 text-[#FF5A1F]" />
              <h3 className="text-sm font-bold text-gray-900">Upcoming Scheduled</h3>
            </div>

            {scheduledCards.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-400">
                No cards currently have a due date.
                <p className="mt-1 text-[11px] text-gray-500">
                  Open any card to set an Editorial Due Date.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {scheduledCards.slice(0, 8).map((c) => (
                  <Link
                    key={c.id}
                    href={`/content/${c.id}`}
                    className="block p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-100/70 transition-all group"
                  >
                    <span className="text-[10px] font-bold text-[#FF5A1F] block uppercase tracking-wider mb-0.5">
                      {c.dueDate || c.postedAt}
                    </span>
                    <h4 className="text-[12.5px] font-bold text-gray-900 group-hover:text-[#FF5A1F] leading-snug truncate">
                      {c.title}
                    </h4>
                    <span className="text-[10.5px] text-gray-400 font-medium mt-1 inline-block">
                      {c.status} · {c.type}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
