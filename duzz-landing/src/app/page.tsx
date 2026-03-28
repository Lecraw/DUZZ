"use client";

import { motion } from "framer-motion";
import { Mic, BarChart3, Sparkles, FileText } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { WaitlistForm } from "@/components/waitlist-form";
import { Logo } from "@/components/logo";

// ─── Hero ───────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center px-6 pt-24 pb-20 text-center">
      {/* Subtle grid bg */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundSize: "60px 60px",
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
          maskImage:
            "radial-gradient(ellipse at center, black 0%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 mx-auto max-w-3xl"
      >
        <h1 className="font-heading text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
          Win DECA.
          <br />
          <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Don&apos;t just compete.
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-zinc-400">
          AI roleplay practice, structured project builders, and performance
          analytics — built specifically for DECA competitors.
        </p>
        <div className="mt-10 flex justify-center">
          <WaitlistForm compact />
        </div>
      </motion.div>
    </section>
  );
}

// ─── What DUZZ Does ─────────────────────────────────────────────────────────

function WhatIsDuzz() {
  const features = [
    {
      icon: <Mic className="h-5 w-5" />,
      title: "AI Roleplay Practice",
      description:
        "Simulate realistic judge interactions for any DECA event. Get scored and reviewed instantly — no practice partner needed.",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      icon: <FileText className="h-5 w-5" />,
      title: "Project Builder",
      description:
        "Step-by-step frameworks for written events, business plans, and presentations. No more staring at a blank page.",
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      icon: <Sparkles className="h-5 w-5" />,
      title: "Actionable Feedback",
      description:
        "Detailed analysis after every session. Know exactly what to fix instead of guessing why you lost.",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      title: "Progress Tracking",
      description:
        "See your scores improve over time. Identify weak areas and focus your prep where it matters.",
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <section id="features" className="border-t border-zinc-800/40 px-6 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        <div className="mb-14 max-w-2xl">
          <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl">
            Everything you need to win.
          </h2>
          <p className="mt-4 text-zinc-400">
            Most DECA students study randomly and compete without real feedback.
            DUZZ gives you structured practice with actual results.
          </p>
        </div>
        <div className="grid gap-10 sm:grid-cols-2">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="flex gap-4"
            >
              <div
                className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${f.bg} ${f.color}`}
              >
                {f.icon}
              </div>
              <div>
                <h3 className="font-heading mb-1.5 text-lg font-semibold text-white">
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed text-zinc-400">
                  {f.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ────────────────────────────────────────────────────────────

function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Practice",
      description:
        "Pick your event and jump into a roleplay simulation or timed practice exam.",
    },
    {
      step: "02",
      title: "Get Feedback",
      description:
        "Receive instant AI analysis — what worked, what didn't, and what to change.",
    },
    {
      step: "03",
      title: "Improve",
      description:
        "Track your progress, target weak areas, and walk into competition prepared.",
    },
  ];

  return (
    <section id="how-it-works" className="border-t border-zinc-800/40 px-6 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        <h2 className="font-heading mb-16 text-center text-3xl font-bold text-white sm:text-4xl">
          How it works
        </h2>
        <div className="relative grid gap-12 md:grid-cols-3">
          <div className="absolute top-8 left-[16.7%] right-[16.7%] hidden h-px bg-gradient-to-r from-zinc-800 via-zinc-600 to-zinc-800 md:block" />
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="relative text-center"
            >
              <div className="font-heading relative z-10 mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-xl font-bold text-blue-400">
                {s.step}
              </div>
              <h3 className="font-heading mb-2 text-xl font-semibold text-white">
                {s.title}
              </h3>
              <p className="text-sm leading-relaxed text-zinc-400">
                {s.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Built By ───────────────────────────────────────────────────────────────

function BuiltBy() {
  return (
    <section className="border-t border-zinc-800/40 px-6 py-24 md:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-heading mb-4 text-3xl font-bold text-white sm:text-4xl">
          Built by DECA competitors.
        </h2>
        <p className="text-zinc-400 leading-relaxed">
          We&apos;ve been through the grind — studying without direction,
          competing without feedback, and wishing something like this existed.
          So we built it.
        </p>
      </div>
    </section>
  );
}

// ─── Final CTA ──────────────────────────────────────────────────────────────

function FinalCTA() {
  return (
    <section id="waitlist-section" className="border-t border-zinc-800/40 px-6 py-24 md:py-32">
      <div className="relative mx-auto max-w-2xl text-center">
        <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-40 w-80 rounded-full bg-blue-500/10 blur-[80px]" />
        <h2 className="font-heading relative mb-4 text-3xl font-bold text-white sm:text-4xl">
          Ready to start winning?
        </h2>
        <p className="relative mb-10 text-zinc-400">
          Join the waitlist and be first to access DUZZ.
        </p>
        <WaitlistForm />
      </div>
    </section>
  );
}

// ─── Footer ─────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-zinc-800/40 px-6 py-12">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 sm:flex-row">
        <Logo size="sm" showIcon={false} />
        <div className="flex items-center gap-6 text-xs text-zinc-500">
          <a href="#features" className="transition-colors hover:text-zinc-300">
            Features
          </a>
          <a
            href="#how-it-works"
            className="transition-colors hover:text-zinc-300"
          >
            How It Works
          </a>
          <a
            href="#waitlist-section"
            className="transition-colors hover:text-zinc-300"
          >
            Waitlist
          </a>
        </div>
        <div className="text-xs text-zinc-600">
          &copy; {new Date().getFullYear()} DUZZ. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="overflow-x-hidden">
        <Hero />
        <WhatIsDuzz />
        <HowItWorks />
        <BuiltBy />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
