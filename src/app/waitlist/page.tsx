"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Zap, Target, TrendingUp, BarChart3 } from "lucide-react";
import { Logo } from "@/components/logo";
import { WaitlistForm } from "@/components/waitlist-form";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";

const features = [
  { icon: <Zap className="w-4 h-4" />, text: "AI-powered roleplay practice" },
  { icon: <Target className="w-4 h-4" />, text: "Event-specific preparation" },
  { icon: <BarChart3 className="w-4 h-4" />, text: "Real-time score analytics" },
  { icon: <TrendingUp className="w-4 h-4" />, text: "Track progress over time" },
];

export default function WaitlistPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left panel — 3D Spline Robot */}
      <div className="hidden lg:flex lg:w-1/2 bg-black/[0.96] relative overflow-hidden items-center justify-center">
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          size={300}
        />

        <SplineScene
          scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
          className="w-full h-full"
        />

        {/* Bottom branding */}
        <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between z-10">
          <div className="flex items-center gap-3 text-white/20 text-xs">
            <Logo size="sm" />
          </div>
          <p className="text-[11px] text-white/15 uppercase tracking-wider">
            Not affiliated with DECA Inc.
          </p>
        </div>
      </div>

      {/* Right panel — Waitlist form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white dark:bg-[#050510] relative min-h-screen lg:min-h-0">
        {/* Back button */}
        <a
          href="/"
          className="absolute top-6 left-6 flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </a>

        <motion.div
          className="w-full max-w-md space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-4">
            <Logo size="md" />
          </div>

          <div className="space-y-3 text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold uppercase tracking-widest border border-blue-500/15 bg-blue-500/5 text-blue-500 dark:border-blue-500/20 dark:bg-blue-500/8">
              <Zap className="w-3 h-3" />
              Early Access
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Join the Waitlist
            </h1>
            <p className="text-zinc-500 dark:text-[rgba(255,255,255,0.5)] text-[15px]">
              Be first to access the AI platform that&apos;s changing how students prepare for DECA.
            </p>
          </div>

          <WaitlistForm />

          {/* Feature list */}
          <div className="grid grid-cols-2 gap-3 pt-4">
            {features.map((f) => (
              <div key={f.text} className="flex items-center gap-2 text-[13px] text-zinc-500 dark:text-[rgba(255,255,255,0.4)]">
                <div className="text-blue-500 shrink-0">{f.icon}</div>
                <span>{f.text}</span>
              </div>
            ))}
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-6 pt-4 border-t border-zinc-200 dark:border-white/[0.06]">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-500">500+</div>
              <div className="text-[10px] text-zinc-400 dark:text-[rgba(255,255,255,0.3)] uppercase tracking-widest">Students</div>
            </div>
            <div className="w-px h-6 bg-zinc-200 dark:bg-white/[0.06]" />
            <div className="text-center">
              <div className="text-lg font-bold text-blue-500">15+</div>
              <div className="text-[10px] text-zinc-400 dark:text-[rgba(255,255,255,0.3)] uppercase tracking-widest">Events</div>
            </div>
            <div className="w-px h-6 bg-zinc-200 dark:bg-white/[0.06]" />
            <div className="text-center">
              <div className="text-lg font-bold text-blue-500">4.9/5</div>
              <div className="text-[10px] text-zinc-400 dark:text-[rgba(255,255,255,0.3)] uppercase tracking-widest">Rating</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
