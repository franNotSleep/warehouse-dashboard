"use client";

import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  variant?: "default" | "success" | "warning" | "danger" | "info";
}

const variantClasses: Record<string, string> = {
  default: "bg-secondary text-secondary-foreground",
  success: "bg-primary/15 text-primary",
  warning: "bg-yellow-500/15 text-warning",
  danger: "bg-destructive/15 text-destructive",
  info: "bg-chart-2/15 text-chart-2",
};

export function StatusBadge({ status, variant = "default" }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium",
        variantClasses[variant],
      )}
    >
      <span
        className={cn("h-1.5 w-1.5 rounded-full", {
          "bg-secondary-foreground": variant === "default",
          "bg-primary": variant === "success",
          "bg-yellow-400": variant === "warning",
          "bg-destructive": variant === "danger",
          "bg-chart-2": variant === "info",
        })}
      />
      {status}
    </span>
  );
}
