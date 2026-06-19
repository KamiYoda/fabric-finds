import * as React from "react";
import { cn } from "@/lib/utils";

interface LabelPillProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "subtle";
  color?: "orange" | "blue" | "green" | "purple" | "yellow";
}

const COLOR_MAP = {
  orange: {
    pill: "border-orange-500/20 text-orange-500",
    dot: "bg-orange-500",
  },
  blue: {
    pill: "border-blue-500/20 text-blue-500",
    dot: "bg-blue-500",
  },
  green: {
    pill: "border-green-500/20 text-green-500",
    dot: "bg-green-500",
  },
  purple: {
    pill: "border-purple-500/20 text-purple-500",
    dot: "bg-purple-500",
  },
  yellow: {
    pill: "border-yellow-500/20 text-yellow-500",
    dot: "bg-yellow-500",
  },
};

export function LabelPill({
  children,
  className,
  variant = "default",
  color = "orange",
  ...props
}: LabelPillProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border-[2px] px-3 py-2 text-xs font-semibold transition shadow-glow hover:shadow-elegant",
        variant === "default"
          ? `${COLOR_MAP[color].pill} bg-white text-black/70`
          : "border-muted/40 bg-muted/20 text-muted-foreground",
        className,
      )}
      {...props}
    >
      {variant === "default" && (
        <span
          className={cn("h-2 w-2 shrink-0 rounded-full", COLOR_MAP[color].dot)}
        />
      )}

      {children}
    </div>
  );
}
