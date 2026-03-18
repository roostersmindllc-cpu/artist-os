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
              "rounded-[1.4rem] border-2 p-4 text-left transition-colors",
              isSelected
                ? "border-fuchsia-400/55 bg-[linear-gradient(180deg,rgba(190,89,255,0.9),rgba(162,73,224,0.98))] text-white shadow-[0_10px_24px_rgba(0,0,0,0.08)]"
                : "border-black/12 bg-white text-muted-foreground hover:bg-primary/10"
            ].join(" ")}
          >
            <p className={isSelected ? "font-medium text-white" : "font-medium text-foreground"}>
              {option.label}
            </p>
            {option.description ? (
              <p
                className={[
                  "mt-1 text-sm leading-6",
                  isSelected ? "text-white/78" : "text-muted-foreground"
                ].join(" ")}
              >
                {option.description}
              </p>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
