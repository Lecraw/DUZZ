"use client";

import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl" | "hero";
  className?: string;
  showIcon?: boolean;
}

const sizeMap = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl",
  xl: "text-4xl",
  hero: "text-6xl md:text-[6rem] lg:text-[8rem]",
};

const iconSizeMap = {
  sm: "h-6 w-6",
  md: "h-7 w-7",
  lg: "h-8 w-8",
  xl: "h-10 w-10",
  hero: "h-16 w-16 md:h-24 md:w-24",
};

/** The DUZZ logomark — an upward bolt/arrow inside a rounded square, representing performance acceleration */
function LogoMark({ className, id = "nav" }: { className?: string; id?: string }) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient
          id={`duzz-bg-${id}`}
          x1="2"
          y1="2"
          x2="34"
          y2="34"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#60A5FA" />
          <stop offset="0.5" stopColor="#3B82F6" />
          <stop offset="1" stopColor="#1E40AF" />
        </linearGradient>
        <linearGradient
          id={`duzz-shine-${id}`}
          x1="6"
          y1="2"
          x2="18"
          y2="20"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.25" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Background — squircle */}
      <rect x="2" y="2" width="32" height="32" rx="9" fill={`url(#duzz-bg-${id})`} />
      <rect x="2" y="2" width="32" height="18" rx="9" fill={`url(#duzz-shine-${id})`} />
      {/* Upward arrow / bolt — represents acceleration & winning */}
      <path
        d="M18 8L11 19h5v9l7-11h-5V8z"
        fill="white"
        fillOpacity="0.95"
      />
    </svg>
  );
}

export function Logo({ size = "md", className, showIcon = true }: LogoProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-heading font-bold tracking-tighter select-none",
        sizeMap[size],
        className
      )}
    >
      {showIcon && (
        <span className={cn("relative flex-shrink-0", iconSizeMap[size])}>
          <LogoMark className="h-full w-full" />
        </span>
      )}
      <span className="relative">
        <span
          className="bg-gradient-to-r from-white via-white to-zinc-400 bg-clip-text text-transparent"
          style={{ WebkitBackgroundClip: "text" }}
        >
          DUZZ
        </span>
        <span className="absolute -bottom-0.5 left-0 h-[2px] w-full bg-gradient-to-r from-blue-500 via-blue-400 to-transparent opacity-50 rounded-full" />
      </span>
    </span>
  );
}

export { LogoMark };
