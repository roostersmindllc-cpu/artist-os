"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type TagInputProps = {
  value: string[];
  onChange: (nextValue: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
};

function normalizeTag(value: string) {
  return value.trim().toLowerCase();
}

export function TagInput({
  value,
  onChange,
  placeholder = "Add a tag and press Enter",
  disabled
}: TagInputProps) {
  const [draft, setDraft] = useState("");

  const addTag = (rawValue: string) => {
    const nextTag = normalizeTag(rawValue);

    if (!nextTag || value.includes(nextTag)) {
      setDraft("");
      return;
    }

    onChange([...value, nextTag]);
    setDraft("");
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div
      className={cn(
        "flex min-h-10 flex-wrap items-center gap-2 rounded-xl border border-input bg-background/80 px-3 py-2 shadow-sm",
        disabled ? "cursor-not-allowed opacity-60" : ""
      )}
    >
      {value.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
        >
          {tag}
          <button
            type="button"
            className="inline-flex size-4 items-center justify-center rounded-full text-primary/80 hover:bg-primary/15 hover:text-primary"
            onClick={() => removeTag(tag)}
            disabled={disabled}
            aria-label={`Remove ${tag}`}
          >
            <X className="size-3" />
          </button>
        </span>
      ))}

      <Input
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === ",") {
            event.preventDefault();
            addTag(draft);
          }

          if (event.key === "Backspace" && !draft && value.length > 0) {
            removeTag(value[value.length - 1]!);
          }
        }}
        onBlur={() => {
          if (draft) {
            addTag(draft);
          }
        }}
        onPaste={(event) => {
          const pastedText = event.clipboardData.getData("text");

          if (!pastedText.includes(",") && !pastedText.includes("\n")) {
            return;
          }

          event.preventDefault();
          const nextTags = pastedText
            .split(/,|\n/g)
            .map(normalizeTag)
            .filter(Boolean);

          onChange([...new Set([...value, ...nextTags])]);
          setDraft("");
        }}
        placeholder={placeholder}
        disabled={disabled}
        className="h-auto min-w-[180px] flex-1 border-0 bg-transparent px-0 py-0 shadow-none focus-visible:ring-0"
      />
    </div>
  );
}
