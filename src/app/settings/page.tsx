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
  Key,
  UserPlus,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Lock,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { useContent } from "@/context/ContentContext";
import { useAuth } from "@/context/AuthContext";

export default function SettingsPage() {
  const { cards, isDbConnected, refreshFromCloud, isSyncing } = useContent();
  const { masterKey, updateMasterKey, members, addMember, removeMember, currentUser } = useAuth();

  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Team Access State
  const [showMasterKey, setShowMasterKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberKey, setNewMemberKey] = useState("");
  const [newMemberRole, setNewMemberRole] = useState<"Editor" | "Viewer">("Editor");
  const [memberAddedSuccess, setMemberAddedSuccess] = useState(false);

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

    const csvData = [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(csvData);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `rewriteminds_pipeline_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setDownloadSuccess("CSV exported successfully!");
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handleCopyMasterKey = () => {
    navigator.clipboard.writeText(masterKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim() || !newMemberKey.trim()) return;

    addMember(newMemberName, newMemberKey, newMemberRole);
    setNewMemberName("");
    setNewMemberKey("");
    setMemberAddedSuccess(true);
    setTimeout(() => setMemberAddedSuccess(false), 3000);
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
            System & Security Settings
          </h1>
          <p className="text-[13px] text-gray-500 mt-0.5">
            Cloud database health, studio authentication, team access permissions, and backups.
          </p>
        </div>

        {downloadSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        {/* Section 1: Studio Access Control & Team Permissions */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-50 text-[#FF5A1F] flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  Studio Authentication & Team Whitelist
                </h3>
                <p className="text-xs text-gray-400">
                  Only you and people with authorized keys listed here can enter Content OS.
                </p>
              </div>
            </div>

            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>Gate Active</span>
            </span>
          </div>

          {/* Master Key Card */}
          <div className="p-4 rounded-xl bg-zinc-950 text-white border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-[#FF5A1F]" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Master Owner Passkey
                </span>
                <span className="text-[10px] bg-red-500/20 text-red-400 font-bold px-2 py-0.5 rounded-full border border-red-500/30">
                  Full Access
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowMasterKey(!showMasterKey)}
                  className="p-1 text-zinc-400 hover:text-white transition-colors"
                  title={showMasterKey ? "Hide key" : "Show key"}
                >
                  {showMasterKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={handleCopyMasterKey}
                  className="text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedKey ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>
            <p className="text-[11px] text-zinc-400">
              This master key unlocks Content OS with full Owner privileges from any device.
            </p>
            <div className="font-mono text-sm tracking-widest text-[#FF5A1F] bg-black/60 p-2.5 rounded-lg border border-zinc-800 select-all">
              {showMasterKey ? masterKey : "••••••••••••••••"}
            </div>
          </div>

          {/* Add New Authorized Member */}
          <div className="pt-2 border-t border-gray-100">
            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <UserPlus className="w-4 h-4 text-gray-500" />
              <span>Give Access to a Collaborator</span>
            </h4>
            <form onSubmit={handleAddMember} className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
              <input
                type="text"
                required
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                placeholder="Name (e.g. Sarah Writer)"
                className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 outline-none focus:border-[#FF5A1F] focus:bg-white"
              />
              <input
                type="text"
                required
                value={newMemberKey}
                onChange={(e) => setNewMemberKey(e.target.value)}
                placeholder="Passkey or Email..."
                className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 font-mono outline-none focus:border-[#FF5A1F] focus:bg-white"
              />
              <select
                value={newMemberRole}
                onChange={(e) => setNewMemberRole(e.target.value as "Editor" | "Viewer")}
                className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 font-medium outline-none"
              >
                <option value="Editor">Editor</option>
                <option value="Viewer">Viewer</option>
              </select>
              <button
                type="submit"
                className="bg-[#1A1A1A] hover:bg-black text-white font-semibold text-xs py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>+ Grant Access</span>
              </button>
            </form>
            {memberAddedSuccess && (
              <p className="text-[11px] font-semibold text-emerald-600 mt-2 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Collaborator key added to whitelist!</span>
              </p>
            )}
          </div>

          {/* Authorized Members List */}
          <div className="pt-2">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
              Authorized Team Members ({members.length})
            </span>
            <div className="space-y-2">
              {members.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50/80 border border-gray-200/70 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-zinc-900 text-white font-bold text-xs flex items-center justify-center">
                      {m.name[0]}
                    </div>
                    <div>
                      <span className="font-bold text-gray-900 block">{m.name}</span>
                      <span className="font-mono text-[10.5px] text-gray-400 block">
                        Key: {m.keyOrEmail}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        m.role === "Owner"
                          ? "bg-red-50 text-red-600 border border-red-200"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {m.role}
                    </span>
                    {m.role !== "Owner" && (
                      <button
                        onClick={() => removeMember(m.id)}
                        className="text-gray-400 hover:text-red-600 p-1 rounded-md transition-colors"
                        title="Revoke Access"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 2: Supabase Database Live Status */}
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

        {/* Section 3: Data Export & Portability */}
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
      </main>
    </div>
  );
}
