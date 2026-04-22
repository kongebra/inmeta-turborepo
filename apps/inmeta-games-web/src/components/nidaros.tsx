import { cn } from "@/lib/utils";
import React from "react";

type SkiltVariant = "rust" | "skog" | "messing" | "muted" | "dark";

const skiltVariants: Record<SkiltVariant, string> = {
  rust: "bg-n-rust text-n-paper border-n-paper outline-n-rust",
  skog: "bg-n-skog text-n-paper border-n-paper outline-n-skog",
  messing: "bg-n-messing text-n-bg border-n-bg outline-n-messing",
  muted: "bg-n-bg3 text-n-ink-dim border-n-ink-dim outline-n-bg3",
  dark: "bg-n-bg3 text-n-ink border-n-line outline-n-bg3",
};

export function Skilt({
  children,
  variant = "rust",
  className,
}: {
  children: React.ReactNode;
  variant?: SkiltVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block font-mono text-[10px] tracking-widest uppercase px-3 py-1",
        "border-2 outline outline-2",
        skiltVariants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

type MedalRank = 1 | 2 | 3;
const medalColors: Record<MedalRank, string> = {
  1: "bg-n-messing text-n-bg border-n-ink",
  2: "bg-n-solv text-n-bg border-n-ink",
  3: "bg-n-bronze text-n-bg border-n-ink",
};

export function Medal({
  rank,
  size = "md",
}: {
  rank: number;
  size?: "sm" | "md" | "lg";
}) {
  if (rank > 3) return null;
  const sizeClass = size === "sm" ? "w-5 h-5 text-[10px]" : size === "lg" ? "w-9 h-9 text-lg" : "w-7 h-7 text-sm";
  return (
    <div
      className={cn(
        "rounded-full border-2 flex items-center justify-center font-display shrink-0",
        sizeClass,
        medalColors[rank as MedalRank]
      )}
    >
      {rank}
    </div>
  );
}

export function NidarosSection({
  title,
  aside,
  children,
  className,
}: {
  title: string;
  aside?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="flex items-center gap-3 mt-7 mb-4">
        <span className="font-mono text-[10px] text-n-rust uppercase tracking-[0.12em] shrink-0">
          {title}
        </span>
        <div className="flex-1 h-px bg-n-line" />
        {aside && (
          <span className="font-mono text-[9px] text-n-ink-dim uppercase tracking-[0.12em] shrink-0">
            {aside}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

const avatarTones = [
  "bg-[#3a3a42]",
  "bg-[#42362a]",
  "bg-[#2f3a35]",
  "bg-[#3e3440]",
  "bg-[#38323e]",
  "bg-[#2a3340]",
];

export function PlayerAvatar({
  firstName,
  lastName,
  imageSrc,
  size = "md",
  tone = 0,
  className,
}: {
  firstName: string;
  lastName: string;
  imageSrc?: string | null;
  size?: "sm" | "md" | "lg";
  tone?: number;
  className?: string;
}) {
  const sizeClass =
    size === "sm"
      ? "w-8 h-8 text-xs"
      : size === "lg"
        ? "w-14 h-14 text-lg"
        : "w-10 h-10 text-sm";
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`;
  const toneCls = avatarTones[tone % avatarTones.length];

  if (imageSrc) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageSrc}
        alt={`${firstName} ${lastName}`}
        className={cn(
          "rounded-full border border-n-line object-cover shrink-0",
          sizeClass,
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-full border border-n-line flex items-center justify-center",
        "font-display text-n-ink-dim shrink-0",
        sizeClass,
        toneCls,
        className
      )}
    >
      {initials}
    </div>
  );
}

export function RankBadge({ rank }: { rank: number }) {
  if (rank <= 3) return <Medal rank={rank} size="sm" />;
  return (
    <span className="font-mono text-[11px] text-n-ink-dim w-5 text-center">
      {rank}
    </span>
  );
}
