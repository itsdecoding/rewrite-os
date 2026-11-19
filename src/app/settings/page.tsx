"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Settings as SettingsIcon,
  Database,
  Download,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  HardDrive,
  User,
  Shield,
  ArrowRight,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { useContent } from "@/context/ContentContext";

export default function SettingsPage() {
  const { cards, isDbConnected, refreshFromCloud, isSyncing } = useContent();

  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const exportToJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cards, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `rewriteminds_content_os_${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setDownloadSuccess("JSON exported successfully!");
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const exportToCsv = () => {
    if (cards.length === 0) return;
    const headers = ["ID", "Title", "Type", "Status", "Category", "Priority", "Writer", "Due Date", "Created At"];
    const rows = cards.map((c) => [
      `"${c.id}"`,
      `"${(c.title || "").replace(/"/g, '""')}"`,
      `"${c.type || ""}"`,
      `"${c.status || ""}"`,
      `"${c.category || ""}"`,
      `"${c.priority || ""}"`,
      `"${c.writer || c.owner || "Muzammil"}"`,
      `"${c.dueDate || ""}"`,
      `"${c.postedAt || ""}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", encodedUri);
    downloadAnchor.setAttribute("download", `rewriteminds_pipeline_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setDownloadSuccess("CSV exported successfully!");
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <div className="min-h-screen pb-20">
      <Header />

      <main className="px-4 sm:px-6 md:px-8 max-w-[1000px] mx-auto space-y-6 pt-2">
        {/* Top Header */}
        <div>
          <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">
            PREFERENCES
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] tracking-tight">
            System & Database Settings
          </h1>
          <p className="text-[13px] text-gray-500 mt-0.5">
            Cloud database health, team authorship configuration, and backup exports.
          </p>
        </div>

        {downloadSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        {/* Section 1: Supabase Database Live Status */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  Supabase Cloud Database
                </h3>
                <p className="text-xs text-gray-400">
                  Project reference: <code className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">viehbqgtrdlxujfbrfms</code>
                </p>
              </div>
            </div>

            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                isDbConnected
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isDbConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                }`}
              />
              <span>{isDbConnected ? "Connected & Live" : "Reconnecting..."}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-3 bg-gray-50/70 rounded-xl border border-gray-100">
              <span className="text-[10.5px] font-bold text-gray-400 uppercase tracking-wider block">
                Total Synced Cards
              </span>
              <span className="text-xl font-bold text-gray-900 mt-1 block">
                {cards.length}
              </span>
            </div>

            <div className="p-3 bg-gray-50/70 rounded-xl border border-gray-100">
              <span className="text-[10.5px] font-bold text-gray-400 uppercase tracking-wider block">
                Sync Engine
              </span>
              <span className="text-sm font-bold text-gray-900 mt-1 block">
                Postgres Realtime WebSocket
              </span>
            </div>

            <div className="p-3 bg-gray-50/70 rounded-xl border border-gray-100 flex flex-col justify-between">
              <span className="text-[10.5px] font-bold text-gray-400 uppercase tracking-wider block">
                Force Re-Sync
              </span>
              <button
                onClick={() => refreshFromCloud()}
                disabled={isSyncing}
                className="mt-1 text-xs font-semibold text-[#FF5A1F] hover:underline flex items-center gap-1"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
                <span>Sync with cloud now</span>
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: Data Export & Portability */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#FF5A1F] flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Data Backups & Export</h3>
              <p className="text-xs text-gray-400">
                Download your complete pipeline records anytime in open formats.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <button
              onClick={exportToJson}
              className="p-4 rounded-xl border border-gray-200/80 hover:border-gray-300 hover:bg-gray-50/60 flex items-center justify-between text-left transition-all cursor-pointer group"
            >
              <div>
                <span className="text-xs font-bold text-gray-900 block group-hover:text-[#FF5A1F] transition-colors">
                  Export Complete JSON Backup
                </span>
                <span className="text-[11.5px] text-gray-400 mt-0.5 block">
                  Includes full slide copy, activities, and metadata.
                </span>
              </div>
              <Download className="w-4 h-4 text-gray-400 group-hover:text-[#FF5A1F] transition-colors" />
            </button>

            <button
              onClick={exportToCsv}
              className="p-4 rounded-xl border border-gray-200/80 hover:border-gray-300 hover:bg-gray-50/60 flex items-center justify-between text-left transition-all cursor-pointer group"
            >
              <div>
                <span className="text-xs font-bold text-gray-900 block group-hover:text-[#FF5A1F] transition-colors">
                  Export CSV Spreadsheet
                </span>
                <span className="text-[11.5px] text-gray-400 mt-0.5 block">
                  Formatted for Google Sheets, Notion, or Excel.
                </span>
              </div>
              <Download className="w-4 h-4 text-gray-400 group-hover:text-[#FF5A1F] transition-colors" />
            </button>
          </div>
        </div>

        {/* Section 3: Brand & Author Profile */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Author & Workspace Identity</h3>
              <p className="text-xs text-gray-400">
                Default assigned writer for new Rewrite Minds drafts.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Workspace Name
              </label>
              <input
                type="text"
                disabled
                value="Rewrite Minds (@rewrite_minds)"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-700 font-semibold cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Primary Founder / Author
              </label>
              <input
                type="text"
                disabled
                value="Muzammil"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-700 font-semibold cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
