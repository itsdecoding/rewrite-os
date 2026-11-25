"use client";

import React from "react";
import Link from "next/link";
import {
  Brain,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Lock,
  Layers,
  Zap,
  BookOpen,
} from "lucide-react";

export default function PublicHomePage() {
  return (
    <div className="min-h-screen bg-[#07070A] text-white selection:bg-red-500/30 selection:text-white relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-red-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-[600px] right-0 w-[400px] h-[400px] bg-[#FF5A1F]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Navigation Header */}
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-black border border-zinc-800 p-0.5 shadow-[0_0_20px_rgba(255,90,31,0.25)]">
            <img
              src="/logo.jpg"
              alt="Rewrite Minds"
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                e.currentTarget.src = "/avatar.jpg";
              }}
            />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-white block leading-none">
              REWRITE MINDS
            </span>
            <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase mt-0.5 block">
              @rewrite_minds
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://threads.net/@rewrite_minds"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-zinc-400 hover:text-white transition-colors hidden sm:block"
          >
            Threads
          </a>
          <a
            href="https://instagram.com/rewrite_minds"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-zinc-400 hover:text-white transition-colors hidden sm:block"
          >
            Instagram
          </a>
          <Link
            href="/studio"
            className="text-xs font-semibold bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white px-3.5 py-1.5 rounded-full border border-zinc-700/80 flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Lock className="w-3 h-3 text-[#FF5A1F]" />
            <span>Studio Access</span>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-20 text-center relative z-10 space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Cognitive Reframing & High-Agency Frameworks</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
          Rewriting Perceptions. <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-[#FF5A1F] to-orange-400">
            Breaking Mental Conditioning.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed font-normal">
          We dissect the invisible cognitive scripts, default behaviors, and applied philosophy that keep high-potential thinkers operating beneath their leverage.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <a
            href="https://threads.net/@rewrite_minds"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-[#FF5A1F] hover:bg-[#E84C12] text-white font-semibold text-sm px-6 py-3.5 rounded-xl shadow-[0_4px_25px_rgba(255,90,31,0.35)] flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <span>Follow on Threads</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href="#products"
            className="w-full sm:w-auto bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white font-semibold text-sm px-6 py-3.5 rounded-xl border border-zinc-800 flex items-center justify-center gap-2 transition-all"
          >
            <span>Explore Products</span>
          </a>
        </div>
      </section>

      {/* 3 Core Pillars */}
      <section className="max-w-5xl mx-auto px-6 py-12 relative z-10">
        <div className="text-center mb-10">
          <span className="text-[11px] font-mono tracking-widest text-[#FF5A1F] uppercase block mb-1">
            CORE FOUNDATION
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            The Three Inversions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-6 space-y-3 hover:border-zinc-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Epistemic Clarity</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Deconstructing inherited narratives and psychological traps. Recognizing when your thoughts are simply learned scripts rather than first-principles reasoning.
            </p>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-6 space-y-3 hover:border-zinc-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-[#FF5A1F] flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Radical High Agency</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Moving from passive reaction to intentional execution. Treating friction as the primary signal for leverage rather than an excuse for avoidance.
            </p>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-6 space-y-3 hover:border-zinc-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Applied Stoicism</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Emotion as diagnostic data, not executive authority. Installing ruthless cognitive filters that drop noise and retain pure signal.
            </p>
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section id="products" className="max-w-5xl mx-auto px-6 py-16 relative z-10">
        <div className="bg-gradient-to-b from-zinc-900/80 to-zinc-950/90 border border-zinc-800 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-red-600/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Flagship System</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Second Brain OS
            </h2>

            <p className="text-sm text-zinc-400 leading-relaxed">
              The private, lightning-fast personal operating system that captures ideas, organizes projects, and tracks habits. Zero subscriptions. Zero Notion bloat. 100% offline.
            </p>

            <ul className="space-y-2 pt-2 text-xs text-zinc-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF5A1F]" />
                <span>Engineered around Tiago Forte's PARA Method</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF5A1F]" />
                <span>7-second quick capture with 4 built-in thought templates</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF5A1F]" />
                <span>Lifetime ownership · Zero monthly fees · 100% private data</span>
              </li>
            </ul>

            <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white">$49</span>
                <span className="text-sm text-zinc-500 line-through">$79</span>
                <span className="text-xs text-emerald-400 font-semibold">Lifetime access</span>
              </div>

              <a
                href="https://threads.net/@rewrite_minds"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#FF5A1F] hover:bg-[#E84C12] text-white font-semibold text-xs px-5 py-3 rounded-xl flex items-center gap-1.5 transition-all shadow-md active:scale-95"
              >
                <span>Get Second Brain OS</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 py-10 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 relative z-10">
        <div>
          &copy; {new Date().getFullYear()} Rewrite Minds. All rights reserved.
        </div>

        <div className="flex items-center gap-5">
          <a
            href="https://threads.net/@rewrite_minds"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-300 transition-colors"
          >
            Threads
          </a>
          <a
            href="https://instagram.com/rewrite_minds"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-300 transition-colors"
          >
            Instagram
          </a>
          <Link
            href="/studio"
            className="hover:text-[#FF5A1F] transition-colors flex items-center gap-1"
          >
            <Lock className="w-3 h-3" />
            <span>Studio Portal</span>
          </Link>
        </div>
      </footer>
    </div>
  );
}
