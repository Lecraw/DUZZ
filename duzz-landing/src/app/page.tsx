"use client";

import { motion } from "framer-motion";
import { Mic, BarChart3, Sparkles, FileText } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Section } from "@/components/section";
import { WaitlistForm } from "@/components/waitlist-form";
import { GlowCard } from "@/components/ui/spotlight-card";
import { CinematicHero } from "@/components/ui/cinematic-landing-hero";
import { Logo } from "@/components/logo";

// ─── Problem ─────────────────────────────────────────────────────────────────

function Problem() {
  const problems = [
    {
      title: "No Structured Practice",
      description:
        "Most DECA students study randomly, flipping through notes without a clear path to improve.",
    },
    {
      title: "Roleplays Are a Guessing Game",
      description:
        "Without real practice partners or structured feedback, students go in blind.",
    },
    {
      title: "Zero Actionable Feedback",
      description:
        "You compete, you lose, and you have no idea what to fix. Judges don't teach.",
    },
    {
      title: "Prepared Events Are Overwhelming",
      description:
        "Written events, presentations, and projects have complex requirements with no guidance.",
    },
  ];

  return (
    <Section>
      <div className="mb-12 text-center">
        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-blue-400">
          The Problem
        </p>
        <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl">
          DECA prep is broken.
        </h2>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {problems.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="rounded-xl border border-zinc-800/60 bg-zinc-900/30 p-6 transition-colors hover:border-zinc-700/50"
          >
            <h3 className="font-heading mb-2 text-lg font-semibold text-white">
              {p.title}
            </h3>
            <p className="text-sm leading-relaxed text-zinc-400">
              {p.description}
            </p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

// ─── Solution ────────────────────────────────────────────────────────────────

function Solution() {
  const solutions = [
    {
      label: "AI Roleplay Simulations",
      desc: "Practice with realistic AI judges that adapt to your event, give scores, and pinpoint weaknesses.",
    },
    {
      label: "Step-by-Step Project Builder",
      desc: "Guided frameworks for written events, presentations, and business plans — no more blank pages.",
    },
    {
      label: "Real DECA-Style Testing",
      desc: "Timed practice exams pulled from actual DECA question patterns. Know what to expect.",
    },
    {
      label: "Performance Analytics",
      desc: "Track your progress across events. See what's improving and what needs more work.",
    },
  ];

  return (
    <Section className="border-t border-zinc-800/40">
      <div className="mb-12 text-center">
        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-blue-400">
          The Solution
        </p>
        <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl">
          Everything you need to win.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
          DUZZ combines structured training, framework-based building, and
          AI-powered feedback into one platform built specifically for DECA
          competitors.
        </p>
      </div>
      <div className="grid gap-8 sm:grid-cols-2">
        {solutions.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="flex gap-4"
          >
            <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-sm font-bold text-blue-400">
              {i + 1}
            </div>
            <div>
              <h3 className="font-heading mb-1 font-semibold text-white">
                {s.label}
              </h3>
              <p className="text-sm leading-relaxed text-zinc-400">{s.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

// ─── Features (GlowCards) ────────────────────────────────────────────────────

function Features() {
  const features = [
    {
      icon: <Mic className="h-5 w-5" />,
      title: "Roleplay Simulator",
      description:
        "AI-powered judges that give you realistic roleplay practice for any DECA event. Get scored and reviewed instantly.",
      glow: "blue" as const,
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      title: "Prepared Event Builder",
      description:
        "Step-by-step frameworks to build winning written events, business plans, and presentations.",
      glow: "purple" as const,
    },
    {
      icon: <Sparkles className="h-5 w-5" />,
      title: "AI Feedback",
      description:
        "Get detailed, actionable feedback on every practice session. Know exactly what to improve.",
      glow: "green" as const,
    },
    {
      icon: <FileText className="h-5 w-5" />,
      title: "Practice Exams",
      description:
        "Timed exams modeled after real DECA tests. Track scores and identify knowledge gaps.",
      glow: "orange" as const,
    },
  ];

  return (
    <Section id="features" className="border-t border-zinc-800/40">
      <div className="mb-14 text-center">
        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-blue-400">
          Features
        </p>
        <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl">
          Built for DECA competitors.
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            <GlowCard
              glowColor={f.glow}
              customSize
              className="h-full w-full !aspect-auto p-6"
            >
              <div className="relative z-10 flex flex-col gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                  {f.icon}
                </div>
                <h3 className="font-heading text-lg font-semibold text-white">
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed text-zinc-400">
                  {f.description}
                </p>
              </div>
            </GlowCard>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

// ─── How It Works ────────────────────────────────────────────────────────────

function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Practice",
      description:
        "Choose your event, enter a roleplay simulation or take a practice exam. Start building your skills with guided exercises.",
    },
    {
      step: "02",
      title: "Get Feedback",
      description:
        "Receive instant AI-powered analysis on your performance. See what worked, what didn't, and exactly what to do differently.",
    },
    {
      step: "03",
      title: "Improve Fast",
      description:
        "Track your progress, target weak areas, and watch your scores climb. Compete with confidence.",
    },
  ];

  return (
    <Section id="how-it-works" className="border-t border-zinc-800/40">
      <div className="mb-16 text-center">
        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-blue-400">
          How It Works
        </p>
        <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl">
          Three steps to DECA dominance.
        </h2>
      </div>
      <div className="relative grid gap-12 md:grid-cols-3">
        <div className="absolute top-8 left-[16.7%] right-[16.7%] hidden h-px bg-gradient-to-r from-zinc-800 via-blue-500/30 to-zinc-800 md:block" />
        {steps.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
            className="relative text-center"
          >
            <div className="font-heading relative z-10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-2xl font-bold text-blue-400">
              {s.step}
            </div>
            <h3 className="font-heading mb-3 text-xl font-semibold text-white">
              {s.title}
            </h3>
            <p className="text-sm leading-relaxed text-zinc-400">
              {s.description}
            </p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

// ─── Social Proof ────────────────────────────────────────────────────────────

function SocialProof() {
  return (
    <Section className="border-t border-zinc-800/40">
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-blue-400">
          Built by Competitors
        </p>
        <h2 className="font-heading mb-8 text-3xl font-bold text-white sm:text-4xl">
          Made by DECA students, for DECA students.
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <GlowCard
            glowColor="blue"
            customSize
            className="h-full w-full !aspect-auto p-6"
          >
            <div className="relative z-10 text-left">
              <p className="mb-4 text-sm leading-relaxed text-zinc-400">
                &ldquo;I wish I had something like this when I was preparing for
                ICDC. The roleplay practice alone would have changed
                everything.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-xs font-bold text-blue-400">
                  DA
                </div>
                <div>
                  <div className="text-sm font-medium text-white">
                    DECA Alum
                  </div>
                  <div className="text-xs text-zinc-500">ICDC Qualifier</div>
                </div>
              </div>
            </div>
          </GlowCard>
          <GlowCard
            glowColor="green"
            customSize
            className="h-full w-full !aspect-auto p-6"
          >
            <div className="relative z-10 text-left">
              <p className="mb-4 text-sm leading-relaxed text-zinc-400">
                &ldquo;Finally, a platform that actually understands what DECA
                competitors need. Not just flashcards — real practice.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">
                  CP
                </div>
                <div>
                  <div className="text-sm font-medium text-white">
                    Chapter President
                  </div>
                  <div className="text-xs text-zinc-500">State Finalist</div>
                </div>
              </div>
            </div>
          </GlowCard>
        </div>
      </div>
    </Section>
  );
}

// ─── Final CTA ───────────────────────────────────────────────────────────────

function FinalCTA() {
  return (
    <Section id="waitlist-section" className="border-t border-zinc-800/40">
      <div className="relative mx-auto max-w-2xl text-center">
        <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-40 w-80 rounded-full bg-blue-500/10 blur-[80px]" />
        <h2 className="font-heading relative mb-4 text-3xl font-bold text-white sm:text-4xl">
          Ready to start winning?
        </h2>
        <p className="relative mb-10 text-zinc-400">
          Join the waitlist and be first to access the platform that&apos;s
          changing how students prepare for DECA.
        </p>
        <WaitlistForm />
      </div>
    </Section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────

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

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="overflow-x-hidden">
        {/* Cinematic GSAP Hero with scroll-driven animation */}
        <CinematicHero
          brandName="DUZZ"
          tagline1="Win DECA."
          tagline2="Don't just compete."
          cardHeading="Performance, redefined."
          cardDescription={
            <>
              <span className="text-white font-semibold">DUZZ</span> empowers
              DECA competitors with AI roleplay simulations, structured project
              builders, and real-time performance analytics.
            </>
          }
          metricValue={98}
          metricLabel="Percentile"
          ctaHeading="Start winning."
          ctaDescription="Join thousands of DECA competitors and take your performance to the next level today."
        />

        {/* Rest of page */}
        <Problem />
        <Solution />
        <Features />
        <HowItWorks />
        <SocialProof />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
