"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckSquare,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { useContent, TaskItem } from "@/context/ContentContext";

export default function TasksPage() {
  const { tasks, addTask, updateTask, deleteTask, cards } = useContent();

  const [activeTab, setActiveTab] = useState<"all" | "todo" | "in_progress" | "done">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDueDate, setNewDueDate] = useState(new Date().toISOString().split("T")[0]);
  const [newPriority, setNewPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [selectedCardId, setSelectedCardId] = useState("");

  const filteredTasks = tasks.filter((t) => {
    if (activeTab === "all") return true;
    return t.status === activeTab;
  });

  const todoCount = tasks.filter((t) => t.status === "todo").length;
  const inProgressCount = tasks.filter((t) => t.status === "in_progress").length;
  const doneCount = tasks.filter((t) => t.status === "done").length;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const linkedCard = cards.find((c) => c.id === selectedCardId);

    addTask({
      title: newTitle,
      cardId: selectedCardId || undefined,
      cardTitle: linkedCard?.title || undefined,
      dueDate: newDueDate,
      priority: newPriority,
      status: "todo",
      assignee: "Muzammil",
    });

    setNewTitle("");
    setSelectedCardId("");
    setIsModalOpen(false);
  };

  const toggleTaskStatus = (task: TaskItem) => {
    const nextStatus =
      task.status === "done" ? "todo" : task.status === "todo" ? "in_progress" : "done";
    updateTask({ ...task, status: nextStatus });
  };

  return (
    <div className="min-h-screen pb-20">
      <Header />

      <main className="px-4 sm:px-6 md:px-8 max-w-[1280px] mx-auto space-y-6 pt-2">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              OPERATIONS
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] tracking-tight">
              Production Tasks
            </h1>
            <p className="text-[13px] text-gray-500 mt-0.5">
              Action items, editing checkpoints, and publishing obligations.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#FF5A1F] hover:bg-[#E84C12] active:scale-95 text-white font-semibold text-[13px] px-4 py-2 rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add New Task</span>
          </button>
        </div>

        {/* Status Counters */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <div
            onClick={() => setActiveTab("todo")}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              activeTab === "todo"
                ? "bg-amber-50/70 border-amber-200 shadow-xs"
                : "bg-white border-gray-100 hover:border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                To Do
              </span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{todoCount}</div>
          </div>

          <div
            onClick={() => setActiveTab("in_progress")}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              activeTab === "in_progress"
                ? "bg-blue-50/70 border-blue-200 shadow-xs"
                : "bg-white border-gray-100 hover:border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                In Progress
              </span>
              <CheckSquare className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{inProgressCount}</div>
          </div>

          <div
            onClick={() => setActiveTab("done")}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              activeTab === "done"
                ? "bg-emerald-50/70 border-emerald-200 shadow-xs"
                : "bg-white border-gray-100 hover:border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Completed
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{doneCount}</div>
          </div>
        </div>

        {/* Task List Container */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
          {/* Subbar filter */}
          <div className="p-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/60 px-4">
            <div className="flex items-center gap-1.5">
              {(["all", "todo", "in_progress", "done"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-[12px] font-semibold px-3 py-1 rounded-lg capitalize transition-colors ${
                    activeTab === tab
                      ? "bg-white text-gray-900 shadow-xs"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {tab.replace("_", " ")}
                </button>
              ))}
            </div>
            <span className="text-[11.5px] text-gray-400 font-medium">
              {filteredTasks.length} items
            </span>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredTasks.length === 0 ? (
              <div className="py-16 text-center text-gray-400 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-gray-300 mx-auto" />
                <p className="text-sm">No tasks in this view.</p>
              </div>
            ) : (
              filteredTasks.map((t) => (
                <div
                  key={t.id}
                  className="p-4 flex items-center justify-between gap-3 hover:bg-gray-50/80 transition-colors group"
                >
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <button
                      onClick={() => toggleTaskStatus(t)}
                      className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all cursor-pointer ${
                        t.status === "done"
                          ? "bg-emerald-600 border-emerald-600 text-white"
                          : t.status === "in_progress"
                          ? "bg-blue-50 border-blue-400 text-blue-600"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {t.status === "done" && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {t.status === "in_progress" && <span className="w-2 h-2 rounded-full bg-blue-600" />}
                    </button>

                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-[13.5px] font-bold text-gray-900 leading-snug truncate ${
                          t.status === "done" ? "line-through text-gray-400" : ""
                        }`}
                      >
                        {t.title}
                      </p>
                      {t.cardTitle && (
                        <span className="text-[11px] text-[#FF5A1F] font-medium flex items-center gap-1 mt-0.5 truncate">
                          <Layers className="w-3 h-3" />
                          <span>{t.cardTitle}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                        t.priority === "High"
                          ? "bg-red-50 text-red-600"
                          : t.priority === "Low"
                          ? "bg-gray-100 text-gray-600"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {t.priority}
                    </span>

                    <span className="text-[12px] text-gray-400 font-medium hidden sm:inline">
                      {t.dueDate}
                    </span>

                    <button
                      onClick={() => deleteTask(t.id)}
                      className="text-gray-300 hover:text-red-500 p-1 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Add Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-gray-900">Add Production Task</h3>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Export 4K vertical cut for Reel..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-sm text-gray-900 outline-none focus:border-[#FF5A1F]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Attach to Content Card (Optional)
                </label>
                <select
                  value={selectedCardId}
                  onChange={(e) => setSelectedCardId(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-gray-800 outline-none"
                >
                  <option value="">None (Independent Task)</option>
                  {cards.slice(0, 25).map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title.slice(0, 50)}...
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-800 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-medium text-gray-800 outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-[#FF5A1F] hover:bg-[#E84C12] text-white rounded-xl shadow-xs"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
