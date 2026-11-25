"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Lock, Key, ArrowRight, ShieldCheck, AlertCircle, Eye, EyeOff, Home } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function StudioAuthGate() {
  const { login } = useAuth();
  const [accessKey, setAccessKey] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    setTimeout(() => {
      const success = login(accessKey);
      if (!success) {
        setError("Access denied. Invalid access key or unauthorized account.");
      }
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#07070A] text-white flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden select-none">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-[#FF5A1F]/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Bar with Home Link */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between z-10 pt-2">
        <Link
          href="/"
          className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors group"
        >
          <Home className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors" />
          <span>&larr; Return to Public Site</span>
        </Link>
        <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800">
          SECURE GATE
        </span>
      </div>

      {/* Center Auth Card */}
      <div className="max-w-md w-full mx-auto my-auto z-10">
        <div className="bg-zinc-900/70 backdrop-blur-2xl border border-zinc-800/90 rounded-3xl p-7 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative">
          {/* Logo & Header */}
          <div className="text-center space-y-3 mb-7">
            <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto bg-black border border-zinc-700/80 shadow-[0_0_30px_rgba(255,90,31,0.2)] p-1">
              <img
                src="/logo.jpg"
                alt="Rewrite Minds"
                className="w-full h-full object-cover rounded-xl"
                onError={(e) => {
                  e.currentTarget.src = "/avatar.jpg";
                }}
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10.5px] font-bold tracking-wider uppercase mb-1.5">
                <Lock className="w-3 h-3 stroke-[2.5]" />
                <span>Restricted Access</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                Content OS Studio
              </h1>
              <p className="text-xs text-zinc-400 mt-1 max-w-[280px] mx-auto leading-relaxed">
                Private editorial engine & pipeline. Only authorized creators and team members may enter.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                Studio Access Key
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <Key className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={accessKey}
                  onChange={(e) => {
                    setAccessKey(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Enter creator passkey..."
                  className="w-full bg-zinc-950/80 border border-zinc-700/80 focus:border-[#FF5A1F] focus:bg-black rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-all font-mono"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !accessKey.trim()}
              className="w-full bg-[#FF5A1F] hover:bg-[#E84C12] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] text-white font-semibold text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(255,90,31,0.35)] transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Unlock Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security footnote */}
          <div className="mt-6 pt-5 border-t border-zinc-800/80 flex items-center justify-center gap-2 text-[11px] text-zinc-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Encrypted local session · Zero external tracking</span>
          </div>
        </div>
      </div>

      {/* Footer copyright */}
      <div className="text-center text-[11px] text-zinc-600 pb-2 z-10">
        &copy; {new Date().getFullYear()} Rewrite Minds. All rights reserved.
      </div>
    </div>
  );
}
