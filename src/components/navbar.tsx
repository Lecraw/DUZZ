"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Logo } from "@/components/logo";
import { StarButton } from "@/components/ui/star-button";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center w-full py-4 px-4">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`flex items-center justify-between px-5 h-11 rounded-full w-full max-w-3xl relative z-10 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 dark:bg-[#050510]/80 backdrop-blur-xl shadow-lg dark:shadow-black/30 shadow-black/5 border border-zinc-200/60 dark:border-white/[0.08]"
            : "bg-white/50 dark:bg-[#050510]/50 backdrop-blur-md border border-zinc-200/30 dark:border-white/[0.06]"
        }`}
      >
        {/* Logo */}
        <a href="#" className="transition-opacity hover:opacity-80 flex items-center" style={{ transform: "translateY(10px)" }}>
          <Logo size="sm" />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((item) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              <a
                href={item.href}
                className="text-[13px] font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                {item.label}
              </a>
            </motion.div>
          ))}
        </nav>

        {/* Desktop Right Side */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Toggle */}
          {mounted && (
            <motion.button
              onClick={toggleTheme}
              className="p-2 rounded-full text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </motion.button>
          )}

          {/* CTA */}
          <StarButton
            href="/waitlist"
            lightColor="#3B82F6"
            duration={3}
            className="h-8 px-4 text-[13px] font-semibold rounded-full"
          >
            Join Waitlist
          </StarButton>
        </div>

        {/* Mobile Right Side */}
        <div className="flex md:hidden items-center gap-2">
          {mounted && (
            <motion.button
              onClick={toggleTheme}
              className="p-2 rounded-full text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </motion.button>
          )}
          <motion.button
            className="p-2"
            onClick={toggleMenu}
            whileTap={{ scale: 0.9 }}
          >
            <Menu className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
          </motion.button>
        </div>
      </motion.div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-white dark:bg-[#050510] z-50 pt-24 px-6 md:hidden"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <motion.button
              className="absolute top-6 right-6 p-2"
              onClick={toggleMenu}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <X className="h-6 w-6 text-zinc-700 dark:text-zinc-300" />
            </motion.button>
            <div className="flex flex-col space-y-6">
              {navLinks.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 + 0.1 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <a
                    href={item.href}
                    className="text-base text-zinc-800 dark:text-zinc-200 font-medium"
                    onClick={toggleMenu}
                  >
                    {item.label}
                  </a>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                exit={{ opacity: 0, y: 20 }}
                className="pt-6"
              >
                <StarButton
                  href="/waitlist"
                  lightColor="#3B82F6"
                  duration={2.5}
                  className="h-12 w-full px-5 text-base font-semibold rounded-full"
                >
                  Join Waitlist
                </StarButton>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
