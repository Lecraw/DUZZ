"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import {
  Mic,
  BarChart3,
  FileText,
  Clock,
  AlertTriangle,
  Users,
  MessageSquareOff,
  Shuffle,
  Target,
  Zap,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { WaitlistForm } from "@/components/waitlist-form";
import { Logo } from "@/components/logo";
import { BackgroundPaths } from "@/components/ui/background-paths";

const RotatingGlobe = dynamic(
  () => import("@/components/ui/wireframe-dotted-globe"),
  { ssr: false }
);

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ─── Grain Texture Overlay ────────────────────────────────────────────────────

function GrainOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[100]"
      aria-hidden="true"
      style={{ opacity: 0.035, mixBlendMode: "overlay" }}
    >
      <svg width="100%" height="100%">
        <filter id="grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </div>
  );
}

// ─── Hero with Notebook ──────────────────────────────────────────────────────

function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const notebookWrapperRef = useRef<HTMLDivElement>(null);
  const notebookInnerRef = useRef<HTMLDivElement>(null);
  const dragWrapperRef = useRef<HTMLDivElement>(null);
  const rightPageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  // Drag-to-spin on closed notebook
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    const startX = e.clientX;
    const startY = e.clientY;
    const el = dragWrapperRef.current;
    if (!el) return;
    const currentRotateX = parseFloat(el.dataset.rx || "0");
    const currentRotateY = parseFloat(el.dataset.ry || "0");

    const onMove = (ev: MouseEvent) => {
      if (!isDragging.current || !el) return;
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      const ry = currentRotateY + dx * 0.4;
      const rx = currentRotateX - dy * 0.3;
      const clampRx = Math.max(-25, Math.min(25, rx));
      const clampRy = Math.max(-35, Math.min(35, ry));
      el.dataset.rx = String(clampRx);
      el.dataset.ry = String(clampRy);
      gsap.set(el, { rotateX: clampRx, rotateY: clampRy });
    };

    const onUp = () => {
      isDragging.current = false;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=280%",
          pin: true,
          scrub: 1,
        },
      });

      // Phase 0 (0–0.05): Reset drag rotation
      scrollTl.to(
        dragWrapperRef.current,
        { rotateX: 0, rotateY: 0, duration: 0.05, ease: "power2.out" },
        0
      );

      // Phase 1 (0.05–0.30): Fade out text, scale up notebook to center
      scrollTl.to(
        textRef.current,
        { opacity: 0, x: -80, duration: 0.2, ease: "power2.in" },
        0.05
      );

      // Calculate scale so the open spread nearly fills the viewport (with visible edges)
      const innerRect = notebookInnerRef.current!.getBoundingClientRect();
      const sectionRect = sectionRef.current!.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const margin = 140; // extra margin so top/bottom edges are visible
      const scaleW = (vw - margin) / (innerRect.width * 2);
      const scaleH = (vh - margin) / innerRect.height;
      const targetScale = Math.min(scaleW, scaleH);

      const centerX = innerRect.left + innerRect.width / 2;
      const centerYInSection = (innerRect.top - sectionRect.top) + innerRect.height / 2;
      const dx = vw / 2 - centerX + (innerRect.width / 2) * targetScale;
      const dy = vh / 2 - centerYInSection;

      scrollTl.to(
        notebookInnerRef.current,
        { scale: targetScale, x: dx, y: dy, duration: 0.25, ease: "power2.inOut" },
        0.07
      );

      // Phase 2 (0.30–0.60): Open the cover
      scrollTl.to(
        coverRef.current,
        { rotateY: -160, duration: 0.3, ease: "power2.inOut" },
        0.30
      );

      // Phase 3 (0.45–0.60): Reveal interior content
      scrollTl.fromTo(
        ".notebook-stat",
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.02, duration: 0.15 },
        0.45
      );
      scrollTl.fromTo(
        ".notebook-chart",
        { scaleY: 0, opacity: 0 },
        { scaleY: 1, opacity: 1, duration: 0.15, transformOrigin: "bottom" },
        0.50
      );

      // Phase 4 (0.70–0.95): Flip the right page to reveal blank page
      scrollTl.to(
        rightPageRef.current,
        { rotateY: -160, duration: 0.25, ease: "power2.inOut" },
        0.70
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      <BackgroundPaths />

      <div
        className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(59,130,246,0.06) 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-12 md:gap-20 pt-24 pb-12">
        {/* Left: Text */}
        <div ref={textRef} className="flex-1">
          <div className="animate-[fadeInUp_1s_0.2s_both]">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none">
              <span className="block text-white">Win DECA.</span>
            </h1>
            <p
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mt-2"
              style={{
                background: "linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.2) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                lineHeight: 1.1,
              }}
            >
              Don&apos;t just compete.
            </p>
          </div>

          <p className="max-w-md text-base sm:text-lg text-zinc-400 leading-relaxed font-light mt-8 animate-[fadeInUp_0.8s_0.6s_both]">
            AI roleplay practice, project builders, and analytics — built for DECA competitors.
          </p>

          <div className="mt-8 animate-[fadeInUp_0.7s_0.8s_both]">
            <a
              href="#waitlist-section"
              className="group inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-blue-500 hover:shadow-[0_0_40px_rgba(59,130,246,0.3)]"
            >
              Join the Waitlist
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>

          <div className="flex items-center gap-8 mt-12 animate-[fadeInUp_0.6s_1s_both]">
            {[
              { value: "500+", label: "Students" },
              { value: "15+", label: "Events" },
              { value: "98th", label: "Percentile" },
            ].map((s, i) => (
              <div key={s.label} className="flex items-center gap-8">
                {i > 0 && <div className="w-px h-8 bg-zinc-800 -ml-8" />}
                <div>
                  <div className="text-2xl font-bold text-white tabular-nums">{s.value}</div>
                  <div className="text-xs text-zinc-500 uppercase tracking-wider mt-0.5">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Notebook */}
        <div
          ref={notebookWrapperRef}
          className="flex-1 flex justify-center md:justify-end"
          style={{ perspective: "2000px" }}
        >
          <div
            ref={dragWrapperRef}
            style={{ transformStyle: "preserve-3d", cursor: "grab" }}
            onMouseDown={handleMouseDown}
          >
          <div
            ref={notebookInnerRef}
            className="relative"
            style={{
              width: "320px",
              height: "420px",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Spine — realistic rounded leather spine */}
            <div
              className="absolute"
              style={{
                left: "-6px",
                top: "-2px",
                width: "18px",
                height: "424px",
                background: "linear-gradient(90deg, #0f0f17 0%, #1c1c2a 30%, #16161f 60%, #0f0f17 100%)",
                borderRadius: "6px 2px 2px 6px",
                boxShadow: "inset 1px 0 2px rgba(255,255,255,0.02), -2px 0 8px rgba(0,0,0,0.5)",
              }}
            >
              {/* Spine ridges */}
              {[60, 130, 290, 360].map((y) => (
                <div key={y} className="absolute left-1 right-1" style={{ top: y, height: "2px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)", borderRadius: "1px" }} />
              ))}
            </div>

            {/* Page edges — multiple layers for realistic thickness */}
            <div className="absolute" style={{ right: "-2px", top: "6px", width: "6px", height: "408px" }}>
              {[0, 1.5, 3].map((offset) => (
                <div key={offset} className="absolute" style={{
                  right: offset,
                  top: offset * 0.5,
                  width: "1.5px",
                  height: `${408 - offset}px`,
                  background: "linear-gradient(180deg, #222228 0%, #1a1a20 50%, #222228 100%)",
                  borderRadius: "0 1px 1px 0",
                  opacity: 1 - offset * 0.15,
                }} />
              ))}
            </div>

            {/* Bottom page edges */}
            <div className="absolute" style={{ bottom: "-2px", left: "12px", right: "6px", height: "5px" }}>
              {[0, 1.5, 3].map((offset) => (
                <div key={offset} className="absolute" style={{
                  bottom: offset,
                  left: 0,
                  right: offset * 0.5,
                  height: "1.5px",
                  background: "linear-gradient(90deg, #1a1a20 0%, #222228 50%, #1a1a20 100%)",
                  borderRadius: "0 0 1px 1px",
                  opacity: 1 - offset * 0.15,
                }} />
              ))}
            </div>

            {/* Blank page (revealed after right page flip) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{
                background: "linear-gradient(160deg, #111113 0%, #0c0c0e 100%)",
                borderRadius: "2px 8px 8px 2px",
              }}
            >
              <div className="absolute left-0 top-0 bottom-0 w-8" style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.2) 0%, transparent 100%)" }} />
              <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
                {Array.from({ length: 20 }, (_, i) => (
                  <line key={i} x1="0" y1={i * 22 + 10} x2="320" y2={i * 22 + 10} stroke="rgba(59,130,246,0.05)" strokeWidth="0.5" />
                ))}
                <line x1="40" y1="0" x2="40" y2="420" stroke="rgba(239,68,68,0.06)" strokeWidth="0.5" />
              </svg>
            </div>

            {/* Right page (flippable — content on front, blank on back) */}
            <div
              ref={rightPageRef}
              className="absolute inset-0"
              style={{
                transformOrigin: "left center",
                transformStyle: "preserve-3d",
              }}
            >
              {/* Front: right page content */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{
                  backfaceVisibility: "hidden",
                  background: "linear-gradient(160deg, #111113 0%, #0c0c0e 100%)",
                  borderRadius: "2px 8px 8px 2px",
                  boxShadow: "inset 2px 0 8px rgba(0,0,0,0.3), 4px 4px 20px rgba(0,0,0,0.5)",
                }}
              >
                <div className="absolute left-0 top-0 bottom-0 w-8" style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.2) 0%, transparent 100%)" }} />
                <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
                  {Array.from({ length: 20 }, (_, i) => (
                    <line key={i} x1="0" y1={i * 22 + 10} x2="320" y2={i * 22 + 10} stroke="rgba(59,130,246,0.05)" strokeWidth="0.5" />
                  ))}
                  <line x1="40" y1="0" x2="40" y2="420" stroke="rgba(239,68,68,0.06)" strokeWidth="0.5" />
                </svg>

                <div className="relative px-10 pt-7">
                  <div className="notebook-stat">
                    <span className="text-[15px] font-semibold text-blue-400 uppercase tracking-wider">Progress</span>
                  </div>
                  <div className="notebook-chart mt-3 mb-4">
                    <svg viewBox="0 0 240 90" className="w-full" fill="none">
                      <text x="0" y="18" fill="#71717a" fontSize="7">100</text>
                      <text x="4" y="48" fill="#71717a" fontSize="7">75</text>
                      <text x="4" y="78" fill="#71717a" fontSize="7">50</text>
                      <path d="M20,15 L238,15" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                      <path d="M20,45 L238,45" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                      <path d="M20,75 L238,75" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                      <path d="M22,62 C30,60 38,53 52,51 C66,49 72,54 86,52 C100,50 108,40 122,36 C136,32 144,30 158,27 C172,24 180,21 194,19 C208,17 216,15 236,13 L236,80 L22,80 Z" fill="url(#chartGrad)" />
                      <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d="M22,62 C30,60 38,53 52,51 C66,49 72,54 86,52 C100,50 108,40 122,36 C136,32 144,30 158,27 C172,24 180,21 194,19 C208,17 216,15 236,13" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" fill="none" />
                      {[[22,62],[52,51],[86,52],[122,36],[158,27],[194,19],[236,13]].map(([x,y],i) => (
                        <circle key={i} cx={x} cy={y} r="2.5" fill="#3b82f6" />
                      ))}
                    </svg>
                  </div>
                  <div className="notebook-stat grid grid-cols-3 gap-3 mb-5">
                    {[
                      { label: "Sessions", value: "47" },
                      { label: "Avg Score", value: "91" },
                      { label: "Streak", value: "12d" },
                    ].map((s) => (
                      <div key={s.label} className="text-center rounded-lg py-2" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <div className="text-xl font-bold text-white">{s.value}</div>
                        <div className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">{s.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="notebook-stat">
                    <div className="text-[12px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">Recent Sessions</div>
                    <div className="space-y-1.5">
                      {[
                        { name: "BFMC Roleplay", score: "94", highlight: true },
                        { name: "Practice Exam", score: "78" },
                        { name: "BLP Presentation", score: "88" },
                      ].map((s) => (
                        <div key={s.name} className="flex items-center gap-2 text-[12px] py-1 px-2 rounded" style={{ background: "rgba(255,255,255,0.02)" }}>
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500/60" />
                          <span className="text-zinc-300">{s.name}</span>
                          <span className="ml-auto font-semibold text-white">{s.score}</span>
                          {s.highlight && <TrendingUp className="w-3 h-3 text-emerald-400" />}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* Back: blank page */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  background: "linear-gradient(200deg, #111113 0%, #0c0c0e 100%)",
                  borderRadius: "8px 2px 2px 8px",
                }}
              >
                <div className="absolute right-0 top-0 bottom-0 w-8" style={{ background: "linear-gradient(270deg, rgba(0,0,0,0.2) 0%, transparent 100%)" }} />
                <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
                  {Array.from({ length: 20 }, (_, i) => (
                    <line key={i} x1="0" y1={i * 22 + 10} x2="320" y2={i * 22 + 10} stroke="rgba(59,130,246,0.05)" strokeWidth="0.5" />
                  ))}
                  <line x1="280" y1="0" x2="280" y2="420" stroke="rgba(239,68,68,0.06)" strokeWidth="0.5" />
                </svg>
              </div>
            </div>

            {/* Cover (card-flip: front = leather cover, back = left page) */}
            <div
              ref={coverRef}
              className="absolute inset-0"
              style={{ transformOrigin: "left center", transformStyle: "preserve-3d" }}
            >
              {/* FRONT FACE — Ultra-realistic leather cover */}
              <div
                className="absolute inset-0"
                style={{
                  backfaceVisibility: "hidden",
                  background: "linear-gradient(155deg, #1a1a2a 0%, #141420 30%, #18182a 60%, #121220 100%)",
                  borderRadius: "2px 8px 8px 2px",
                  boxShadow: "6px 6px 30px rgba(0,0,0,0.6), 2px 2px 8px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.02)",
                }}
              >
                {/* Leather grain texture */}
                <div className="absolute inset-0" style={{
                  borderRadius: "2px 8px 8px 2px",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                  opacity: 0.04,
                  mixBlendMode: "overlay",
                }} />

                {/* Stitching border */}
                <div className="absolute" style={{
                  inset: "10px",
                  border: "1px dashed rgba(255,255,255,0.06)",
                  borderRadius: "2px 6px 6px 2px",
                  pointerEvents: "none",
                }} />

                {/* Inner stitching glow */}
                <div className="absolute" style={{
                  inset: "11px",
                  boxShadow: "inset 0 0 15px rgba(0,0,0,0.3)",
                  borderRadius: "2px 6px 6px 2px",
                  pointerEvents: "none",
                }} />

                {/* Elastic closure band */}
                <div className="absolute top-0 bottom-0" style={{
                  right: "24px",
                  width: "3px",
                  background: "linear-gradient(180deg, rgba(100,100,120,0.3) 0%, rgba(80,80,100,0.4) 50%, rgba(100,100,120,0.3) 100%)",
                  borderRadius: "2px",
                  boxShadow: "0 0 3px rgba(0,0,0,0.3), inset 0 0 1px rgba(255,255,255,0.05)",
                }} />

                {/* Bookmark ribbon */}
                <div className="absolute" style={{
                  top: 0,
                  right: "50px",
                  width: "8px",
                  height: "50px",
                  background: "linear-gradient(180deg, #2d4a8a 0%, #1e3568 100%)",
                  borderRadius: "0 0 1px 1px",
                  clipPath: "polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }} />

                {/* DUZZ embossed text — debossed into leather */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Deep shadow (deboss) */}
                    <span
                      className="absolute text-4xl font-black tracking-[0.3em]"
                      style={{ color: "rgba(0,0,0,0.6)", transform: "translate(0.5px, 2px)" }}
                      aria-hidden="true"
                    >
                      DUZZ
                    </span>
                    {/* Inner highlight */}
                    <span
                      className="absolute text-4xl font-black tracking-[0.3em]"
                      style={{ color: "rgba(255,255,255,0.03)", transform: "translate(-0.5px, -0.5px)" }}
                      aria-hidden="true"
                    >
                      DUZZ
                    </span>
                    {/* Metallic foil text */}
                    <span
                      className="relative text-4xl font-black tracking-[0.3em]"
                      style={{
                        background: "linear-gradient(170deg, #a0a0a8 0%, #d4d4d8 15%, #e8e8ec 30%, #a1a1aa 45%, #c8c8d0 55%, #71717a 70%, #a8a8b0 85%, #d4d4d8 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        filter: "drop-shadow(0 1px 0 rgba(0,0,0,0.4))",
                      }}
                    >
                      DUZZ
                    </span>
                  </div>
                </div>

                {/* Corner reinforcement patches */}
                <div className="absolute bottom-3 right-3 w-5 h-5 border-r border-b border-white/[0.03] rounded-br-md" />
                <div className="absolute top-3 right-3 w-5 h-5 border-r border-t border-white/[0.03] rounded-tr-md" />

                {/* Subtle sheen highlight */}
                <div className="absolute inset-0 pointer-events-none" style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.01) 100%)",
                  borderRadius: "2px 8px 8px 2px",
                }} />
              </div>

              {/* BACK FACE — Left page */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  background: "linear-gradient(200deg, #111113 0%, #0c0c0e 100%)",
                  borderRadius: "8px 2px 2px 8px",
                  boxShadow: "inset -2px 0 8px rgba(0,0,0,0.2)",
                }}
              >
                <div className="absolute right-0 top-0 bottom-0 w-8" style={{ background: "linear-gradient(270deg, rgba(0,0,0,0.2) 0%, transparent 100%)" }} />
                <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
                  {Array.from({ length: 20 }, (_, i) => (
                    <line key={i} x1="0" y1={i * 22 + 10} x2="320" y2={i * 22 + 10} stroke="rgba(59,130,246,0.05)" strokeWidth="0.5" />
                  ))}
                  <line x1="280" y1="0" x2="280" y2="420" stroke="rgba(239,68,68,0.06)" strokeWidth="0.5" />
                </svg>

                <div className="notebook-stat relative px-8 pt-7 pr-12">
                  <span className="text-[15px] font-semibold text-blue-400 uppercase tracking-wider">Study Plan</span>
                  <div className="notebook-stat mt-4 space-y-2">
                    {[
                      { text: "Review marketing concepts", done: true },
                      { text: "Practice BFMC roleplay", done: true },
                      { text: "Finish Written Event draft", done: false },
                      { text: "Mock presentation (15 min)", done: false },
                      { text: "Study finance terms Ch.4", done: false },
                    ].map((item) => (
                      <div key={item.text} className="flex items-center gap-2.5 text-[12px]">
                        <div className="w-4 h-4 rounded border flex items-center justify-center flex-shrink-0" style={{ borderColor: item.done ? "rgba(59,130,246,0.5)" : "rgba(255,255,255,0.1)", background: item.done ? "rgba(59,130,246,0.1)" : "transparent" }}>
                          {item.done && (
                            <svg viewBox="0 0 12 12" width="10" height="10" fill="none">
                              <path d="M3 6l2 2 4-4" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                        <span className={item.done ? "text-zinc-500 line-through" : "text-zinc-300"}>{item.text}</span>
                      </div>
                    ))}
                  </div>
                  <div className="notebook-stat mt-6">
                    <div className="text-[12px] font-semibold text-zinc-400 uppercase tracking-wider mb-3">Event Focus</div>
                    <div className="space-y-2">
                      {[
                        { label: "Roleplay", pct: 40, color: "#3b82f6" },
                        { label: "Written", pct: 30, color: "#8b5cf6" },
                        { label: "Exam Prep", pct: 30, color: "#6366f1" },
                      ].map((e) => (
                        <div key={e.label}>
                          <div className="flex items-center justify-between text-[11px] mb-1">
                            <span className="text-zinc-400">{e.label}</span>
                            <span className="text-zinc-500">{e.pct}%</span>
                          </div>
                          <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }}>
                            <div className="h-full rounded-full" style={{ width: `${e.pct}%`, background: e.color, opacity: 0.6 }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="notebook-stat mt-6">
                    <div className="text-[12px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">Upcoming</div>
                    <div className="space-y-2">
                      {[
                        { event: "ICDC Prep", date: "Apr 1" },
                        { event: "Mock Competition", date: "Apr 8" },
                      ].map((e) => (
                        <div key={e.event} className="flex items-center gap-2 text-[12px] py-1.5 px-2 rounded" style={{ background: "rgba(255,255,255,0.02)" }}>
                          <Clock className="w-3 h-3 text-zinc-500" />
                          <span className="text-zinc-300">{e.event}</span>
                          <span className="ml-auto text-zinc-500 text-[11px]">{e.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Device Mockups ──────────────────────────────────────────────────────────

function DeviceMockups() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".device-phone",
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".device-phone",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
      gsap.fromTo(
        ".device-laptop",
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".device-laptop",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative px-6 py-28 md:py-36">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-px bg-gradient-to-r from-transparent via-zinc-700/60 to-transparent" />

      <div className="mx-auto max-w-6xl">
        <div className="reveal-item text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400 mb-4">
            The Platform
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            Practice anywhere. Track everything.
          </h2>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20">
          {/* Phone */}
          <div
            className="device-phone relative w-[240px] sm:w-[260px]"
            style={{ perspective: "1000px" }}
          >
            <div className="relative rounded-[2.5rem] overflow-hidden border-[5px] border-zinc-800 bg-[#0a0a12] shadow-[0_30px_80px_-15px_rgba(0,0,0,0.7),0_0_40px_-10px_rgba(59,130,246,0.1)]">
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[80px] h-[22px] bg-black rounded-full z-20" />
              <div className="pt-10 pb-5 px-4 space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <svg viewBox="0 0 36 36" className="w-5 h-5" fill="none">
                    <rect
                      x="2"
                      y="2"
                      width="32"
                      height="32"
                      rx="9"
                      fill="#3B82F6"
                    />
                    <path
                      d="M18 8L11 19h5v9l7-11h-5V8z"
                      fill="white"
                      fillOpacity="0.95"
                    />
                  </svg>
                  <span className="text-xs font-bold text-white">DUZZ</span>
                </div>

                <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                  <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 80 80"
                  >
                    <circle
                      cx="40"
                      cy="40"
                      r="32"
                      fill="none"
                      stroke="rgba(255,255,255,0.04)"
                      strokeWidth="6"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="32"
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray="201"
                      strokeDashoffset="30"
                      style={{
                        transform: "rotate(-90deg)",
                        transformOrigin: "center",
                      }}
                    />
                  </svg>
                  <div className="text-center">
                    <span className="text-lg font-extrabold text-white">
                      98
                    </span>
                    <span className="block text-[7px] text-blue-300/60 uppercase tracking-widest font-semibold">
                      Percentile
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { label: "Roleplays", value: "47" },
                    { label: "Score", value: "91" },
                    { label: "Streak", value: "12d" },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="rounded-lg bg-white/[0.03] border border-white/[0.04] p-1.5 text-center"
                    >
                      <div className="text-[8px] text-zinc-500">{s.label}</div>
                      <div className="text-sm font-bold text-white">
                        {s.value}
                      </div>
                    </div>
                  ))}
                </div>

                {[
                  {
                    name: "BFMC Roleplay",
                    detail: "Score: 94/100",
                    badge: "+6",
                    badgeColor: "text-emerald-400",
                  },
                  {
                    name: "Practice Exam",
                    detail: "78/100 questions",
                    badge: "78%",
                    badgeColor: "text-amber-400",
                  },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-3 rounded-xl bg-white/[0.02] border border-white/[0.04] p-2.5"
                  >
                    <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-400/10">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-semibold text-white">
                        {item.name}
                      </div>
                      <div className="text-[8px] text-zinc-500">
                        {item.detail}
                      </div>
                    </div>
                    <span
                      className={`text-[9px] font-bold ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Laptop */}
          <div
            className="device-laptop w-[380px] sm:w-[460px]"
            style={{ perspective: "1000px" }}
          >
            <div className="rounded-t-xl overflow-hidden border-[3px] border-zinc-700 bg-[#0a0a12]">
              <div className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900/80 border-b border-zinc-800">
                <div className="w-2 h-2 rounded-full bg-red-500/50" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                <div className="w-2 h-2 rounded-full bg-green-500/50" />
                <div className="ml-3 flex-1 h-5 rounded-md bg-zinc-800/60 flex items-center px-2">
                  <span className="text-[8px] text-zinc-500">
                    duzz.app/dashboard
                  </span>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg
                      viewBox="0 0 36 36"
                      className="w-5 h-5"
                      fill="none"
                    >
                      <rect
                        x="2"
                        y="2"
                        width="32"
                        height="32"
                        rx="9"
                        fill="#3B82F6"
                      />
                      <path
                        d="M18 8L11 19h5v9l7-11h-5V8z"
                        fill="white"
                        fillOpacity="0.95"
                      />
                    </svg>
                    <span className="text-xs font-bold text-white">
                      Dashboard
                    </span>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700" />
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: "Sessions", value: "47", color: "text-white" },
                    {
                      label: "Avg Score",
                      value: "91",
                      color: "text-blue-400",
                    },
                    {
                      label: "Streak",
                      value: "12d",
                      color: "text-emerald-400",
                    },
                    { label: "Rank", value: "#3", color: "text-amber-400" },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-2 text-center"
                    >
                      <div className="text-[7px] text-zinc-500 mb-0.5">
                        {s.label}
                      </div>
                      <div className={`text-sm font-bold ${s.color}`}>
                        {s.value}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-3">
                  <div className="text-[8px] text-zinc-500 mb-2">
                    Score Trend
                  </div>
                  <svg
                    viewBox="0 0 400 60"
                    className="w-full"
                    fill="none"
                  >
                    <defs>
                      <linearGradient
                        id="laptopGrad"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#3B82F6"
                          stopOpacity="0.15"
                        />
                        <stop
                          offset="100%"
                          stopColor="#3B82F6"
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,45 L50,38 L100,42 L150,30 L200,25 L250,18 L300,12 L350,8 L400,5 L400,60 L0,60Z"
                      fill="url(#laptopGrad)"
                    />
                    <path
                      d="M0,45 L50,38 L100,42 L150,30 L200,25 L250,18 L300,12 L350,8 L400,5"
                      stroke="#3B82F6"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
            {/* Laptop base */}
            <div
              className="mx-auto h-2.5 bg-zinc-700 rounded-b-xl"
              style={{ width: "105%" }}
            />
            <div
              className="mx-auto h-1 bg-zinc-800 rounded-b-lg"
              style={{ width: "40%" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Problem ─────────────────────────────────────────────────────────────────

function Problem() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".reveal-item").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const problems = [
    {
      icon: <Shuffle className="w-5 h-5 text-zinc-500" />,
      title: "No structure",
      desc: "Students study randomly with no clear path to improve.",
    },
    {
      icon: <MessageSquareOff className="w-5 h-5 text-zinc-500" />,
      title: "No practice partners",
      desc: "Roleplays are blind without realistic simulations.",
    },
    {
      icon: <AlertTriangle className="w-5 h-5 text-zinc-500" />,
      title: "Zero feedback",
      desc: "You lose and have no idea what went wrong.",
    },
    {
      icon: <Users className="w-5 h-5 text-zinc-500" />,
      title: "Coaches can't scale",
      desc: "One-on-one prep doesn't reach every competitor.",
    },
  ];

  return (
    <section ref={sectionRef} className="relative px-6 py-28 md:py-36">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-px bg-gradient-to-r from-transparent via-zinc-700/60 to-transparent" />

      <div className="mx-auto max-w-4xl">
        <div className="reveal-item text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400 mb-4">
            The Problem
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
            DECA prep is broken.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {problems.map((p, i) => (
            <div
              key={i}
              className="reveal-item p-5 rounded-xl bg-white/[0.02] border border-white/[0.04]"
            >
              <div className="mb-3">{p.icon}</div>
              <h3 className="text-sm font-semibold text-white mb-1">
                {p.title}
              </h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Solutions ───────────────────────────────────────────────────────────────

function Solutions() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".feature-box").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const items = [
    {
      icon: <Mic className="w-5 h-5 text-zinc-500" />,
      title: "AI Roleplay",
      desc: "Practice with adaptive AI judges, scored instantly.",
    },
    {
      icon: <FileText className="w-5 h-5 text-zinc-500" />,
      title: "Project Builder",
      desc: "Guided frameworks for written events and plans.",
    },
    {
      icon: <Clock className="w-5 h-5 text-zinc-500" />,
      title: "Practice Exams",
      desc: "Timed tests modeled after real DECA exams.",
    },
    {
      icon: <BarChart3 className="w-5 h-5 text-zinc-500" />,
      title: "Analytics",
      desc: "Track progress across events and sessions.",
    },
    {
      icon: <Target className="w-5 h-5 text-zinc-500" />,
      title: "Event-Specific",
      desc: "Every session tailored to your chosen event.",
    },
    {
      icon: <Zap className="w-5 h-5 text-zinc-500" />,
      title: "Instant Scoring",
      desc: "Detailed breakdowns seconds after each session.",
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-zinc-500" />,
      title: "Progress Tracking",
      desc: "Visual dashboards showing improvement over time.",
    },
    {
      icon: <Users className="w-5 h-5 text-zinc-500" />,
      title: "By Competitors",
      desc: "Created by DECA students who know what it takes.",
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative px-6 py-28 md:py-36"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-px bg-gradient-to-r from-transparent via-zinc-700/60 to-transparent" />

      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400 mb-4">
            Features
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Everything you need to win.
          </h2>
          <p className="text-zinc-400 text-lg max-w-lg mx-auto">
            One platform. AI-powered. Built specifically for DECA.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item, i) => (
            <div
              key={i}
              className="feature-box p-5 rounded-xl bg-white/[0.02] border border-white/[0.04] transition-colors hover:bg-white/[0.04]"
            >
              <div className="mb-3">{item.icon}</div>
              <h3 className="text-sm font-semibold text-white mb-1">
                {item.title}
              </h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ────────────────────────────────────────────────────────────

function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".step-item").forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            delay: i * 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      gsap.fromTo(
        ".connect-line",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: ".connect-line",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const steps = [
    {
      num: "01",
      title: "Practice",
      desc: "Choose your event. Enter a roleplay or take a practice exam.",
      icon: <Mic className="w-5 h-5" />,
    },
    {
      num: "02",
      title: "Get Feedback",
      desc: "Instant AI analysis. See exactly what to improve.",
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      num: "03",
      title: "Win",
      desc: "Track progress, target weak areas, compete with confidence.",
      icon: <Target className="w-5 h-5" />,
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative px-6 py-28 md:py-36"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-px bg-gradient-to-r from-transparent via-zinc-700/60 to-transparent" />

      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400 mb-4">
            How It Works
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            Three steps to DECA dominance.
          </h2>
        </div>

        <div className="relative">
          <div className="connect-line hidden md:block absolute top-[3.25rem] left-[16%] right-[16%] h-px bg-gradient-to-r from-blue-500/40 via-blue-400/20 to-blue-500/40 origin-left" />

          <div className="grid md:grid-cols-3 gap-12 md:gap-8">
            {steps.map((s) => (
              <div key={s.num} className="step-item text-center">
                <div className="relative inline-flex items-center justify-center w-16 h-16 mb-6">
                  <div className="absolute inset-0 rounded-full bg-white/[0.02] border border-white/[0.06]" />
                  <span className="relative text-zinc-400">{s.icon}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  {s.title}
                </h3>
                <p className="text-zinc-400 leading-relaxed max-w-xs mx-auto">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Globe Section ───────────────────────────────────────────────────────────

function GlobeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".globe-content",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".globe-content",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative px-6 py-20 md:py-28">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-px bg-gradient-to-r from-transparent via-zinc-700/60 to-transparent" />

      <div className="globe-content mx-auto max-w-5xl flex flex-col md:flex-row items-center gap-10 md:gap-16">
        <div className="flex-1 text-center md:text-left">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400 mb-4">
            Global Reach
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
            DECA competitors everywhere.
          </h2>
          <p className="text-zinc-400 text-lg leading-relaxed max-w-md mx-auto md:mx-0">
            From chapter meetings to ICDC, DUZZ trains students across every
            region and competition level.
          </p>
        </div>
        <div className="relative w-[300px] h-[300px] sm:w-[360px] sm:h-[360px] shrink-0">
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)",
            }}
            aria-hidden="true"
          />
          <RotatingGlobe width={360} height={360} className="w-full h-full" />
        </div>
      </div>
    </section>
  );
}

// ─── Social Proof ────────────────────────────────────────────────────────────

function SocialProof() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".quote-item").forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            delay: i * 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative px-6 py-28 md:py-36">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-px bg-gradient-to-r from-transparent via-zinc-700/60 to-transparent" />

      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400 mb-6 text-center">
          Built by Competitors
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-14">
          Made by DECA students, for DECA students.
        </h2>

        <div className="grid sm:grid-cols-2 gap-12">
          {[
            {
              quote:
                "I wish I had something like this when I was preparing for ICDC. The roleplay practice alone would have changed everything.",
              name: "DECA Alum",
              role: "ICDC Qualifier",
              initials: "DA",
            },
            {
              quote:
                "Finally, a platform that actually understands what DECA competitors need. Not just flashcards — real practice.",
              name: "Chapter President",
              role: "State Finalist",
              initials: "CP",
            },
          ].map((t, i) => (
            <div key={i} className="quote-item">
              <svg
                className="w-8 h-8 text-blue-500/20 mb-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10H0z" />
              </svg>
              <blockquote className="text-zinc-300 leading-relaxed mb-6 text-[15px]">
                {t.quote}
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-400">
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm font-medium text-white">
                    {t.name}
                  </div>
                  <div className="text-xs text-zinc-500">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Final CTA ───────────────────────────────────────────────────────────────

function FinalCTA() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cta-content",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".cta-content",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="waitlist-section"
      className="relative px-6 py-28 md:py-36"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-px bg-gradient-to-r from-transparent via-zinc-700/60 to-transparent" />

      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(59,130,246,0.06) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />
      <div className="cta-content relative mx-auto max-w-2xl text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
          Ready to start winning?
        </h2>
        <p className="text-zinc-400 mb-10 text-lg">
          Join the waitlist and be first to access the platform that&apos;s
          changing how students prepare for DECA.
        </p>
        <WaitlistForm />
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-zinc-800/40 px-6 py-12">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 sm:flex-row">
        <Logo size="sm" showIcon={false} />
        <div className="flex items-center gap-6 text-xs text-zinc-500">
          <a
            href="#features"
            className="transition-colors hover:text-zinc-300"
          >
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
      <GrainOverlay />
      <Navbar />
      <main style={{ overflowX: "clip" }}>
        <Hero />
        <DeviceMockups />
        <Problem />
        <Solutions />
        <HowItWorks />
        <GlobeSection />
        <SocialProof />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
