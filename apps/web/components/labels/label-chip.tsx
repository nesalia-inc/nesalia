"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LabelChipProps {
  label: {
    id: string;
    title: string;
    color: string;
    description?: string | null;
  };
  size?: "sm" | "md";
  onRemove?: () => void;
  onClick?: () => void;
  className?: string;
}

const colorMap: Record<string, { bg: string; border: string; text: string }> = {
  red: { bg: "bg-red-500/12", border: "border-red-500", text: "text-red-600" },
  orange: { bg: "bg-orange-500/12", border: "border-orange-500", text: "text-orange-600" },
  yellow: { bg: "bg-yellow-500/12", border: "border-yellow-500", text: "text-yellow-600" },
  green: { bg: "bg-green-500/12", border: "border-green-500", text: "text-green-600" },
  teal: { bg: "bg-teal-500/12", border: "border-teal-500", text: "text-teal-600" },
  blue: { bg: "bg-blue-500/12", border: "border-blue-500", text: "text-blue-600" },
  indigo: { bg: "bg-indigo-500/12", border: "border-indigo-500", text: "text-indigo-600" },
  purple: { bg: "bg-purple-500/12", border: "border-purple-500", text: "text-purple-600" },
  pink: { bg: "bg-pink-500/12", border: "border-pink-500", text: "text-pink-600" },
  brown: { bg: "bg-amber-700/12", border: "border-amber-700", text: "text-amber-700" },
  gray: { bg: "bg-gray-500/12", border: "border-gray-500", text: "text-gray-600" },
  black: { bg: "bg-gray-900/12", border: "border-gray-900", text: "text-gray-900" },
};

export function LabelChip({ label, size = "md", onRemove, onClick, className }: LabelChipProps) {
  const colors = colorMap[label.color] ?? colorMap["gray"];

  const chip = (
    <span
      className={`
        inline-flex items-center gap-1 rounded border font-medium
        ${colors.bg} ${colors.border} ${colors.text}
        ${size === "sm" ? "px-1.5 py-0.5 text-xs" : "px-2 py-1 text-[13px]"}
        ${onClick ? "cursor-pointer hover:opacity-80" : ""}
        ${className ?? ""}
      `}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={`Label: ${label.title}`}
    >
      {label.title}
      {onRemove && (
        <Button
          variant="ghost"
          size="icon-sm"
          className="h-3 w-3 p-0 ml-0.5 hover:bg-transparent hover:opacity-70"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </span>
  );

  if (label.description) {
    return (
      <span title={label.description}>
        {chip}
      </span>
    );
  }

  return chip;
}