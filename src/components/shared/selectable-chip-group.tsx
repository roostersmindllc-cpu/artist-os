"use client";

type SelectableChipGroupOption<TValue extends string> = {
  value: TValue;
  label: string;
  description?: string;
};

type SelectableChipGroupProps<TValue extends string> = {
  options: SelectableChipGroupOption<TValue>[];
  selectedValues: TValue[];
  onToggle: (value: TValue) => void;
  ariaLabel?: string;
};

export function SelectableChipGroup<TValue extends string>({
  options,
  selectedValues,
  onToggle,
  ariaLabel
}: SelectableChipGroupProps<TValue>) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="grid gap-3 sm:grid-cols-2"
    >
      {options.map((option) => {
        const isSelected = selectedValues.includes(option.value);

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onToggle(option.value)}
            className={[
              "rounded-2xl border p-4 text-left transition-colors",
              isSelected
                ? "border-primary/30 bg-primary/10 text-foreground shadow-sm"
                : "border-border/70 bg-background/45 text-muted-foreground hover:bg-accent/45"
            ].join(" ")}
          >
            <p className="font-medium text-foreground">{option.label}</p>
            {option.description ? (
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {option.description}
              </p>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
