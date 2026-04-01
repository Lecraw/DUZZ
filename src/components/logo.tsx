"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl" | "hero";
  className?: string;
}

const imgSizeMap = {
  sm: 80,
  md: 112,
  lg: 144,
  xl: 192,
  hero: 280,
};

const heightMap = {
  sm: 68,
  md: 72,
  lg: 88,
  xl: 112,
  hero: 160,
};

export function Logo({ size = "md", className }: LogoProps) {
  const s = imgSizeMap[size];
  const h = heightMap[size];

  return (
    <span
      className={cn(
        "inline-flex items-center select-none",
        className
      )}
    >
      <Image
        src="/duzz-logo.png"
        alt="DUZZ"
        width={s}
        height={s}
        className="flex-shrink-0 object-contain"
        style={{ width: "auto", height: h }}
      />
    </span>
  );
}
