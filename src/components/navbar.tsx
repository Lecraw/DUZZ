"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Logo } from "@/components/logo";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3.5">
        <a href="#" className="transition-opacity hover:opacity-80">
          <Logo size="sm" />
        </a>
        <div className="hidden items-center gap-8 sm:flex">
          <a
            href="#features"
            className="text-[13px] font-medium text-zinc-400 transition-colors hover:text-white"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-[13px] font-medium text-zinc-400 transition-colors hover:text-white"
          >
            How It Works
          </a>
          <a
            href="#waitlist-section"
            className="rounded-lg bg-blue-600 px-4 py-2 text-[13px] font-semibold text-white transition-all hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/20"
          >
            Join Waitlist
          </a>
        </div>
        <a
          href="#waitlist-section"
          className="rounded-lg bg-blue-600 px-4 py-2 text-[13px] font-semibold text-white transition-all hover:bg-blue-500 sm:hidden"
        >
          Join Waitlist
        </a>
      </div>
    </motion.nav>
  );
}
