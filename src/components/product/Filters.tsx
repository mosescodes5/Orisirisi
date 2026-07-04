"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const SWATCHES = [
  { color: "#D4AF37", name: "Gold" },
  { color: "#C0C0C0", name: "Silver" },
  { color: "#EF430B", name: "Rust" },
  { color: "#111111", name: "Black" },
  { color: "#F4E9D8", name: "Pearl" },
];

export function Filters({
  subcategories,
  selected,
  onToggle,
  maxPrice,
  priceLimit,
  onPriceChange,
  swatch,
  onSwatchChange,
  onClear,
}: {
  subcategories: string[];
  selected: string[];
  onToggle: (subcategory: string) => void;
  maxPrice: number;
  priceLimit: number;
  onPriceChange: (value: number) => void;
  swatch: string | null;
  onSwatchChange: (value: string | null) => void;
  onClear: () => void;
}) {
  const hasActiveFilters = selected.length > 0 || priceLimit < maxPrice || swatch !== null;

  return (
    <div>
      <FilterBlock title="Category">
        <div className="flex flex-col gap-3">
          {subcategories.map((s) => (
            <label
              key={s}
              className="flex cursor-pointer items-center gap-2.5 text-[13.5px] text-ink/60 transition-colors hover:text-ink"
            >
              <Checkbox checked={selected.includes(s)} onChange={() => onToggle(s)} />
              {s}
            </label>
          ))}
        </div>
      </FilterBlock>

      <FilterBlock title="Price">
        <input
          type="range"
          min={1000}
          max={maxPrice}
          value={priceLimit}
          onChange={(e) => onPriceChange(Number(e.target.value))}
          className="w-full accent-orisirisi"
        />
        <div className="mt-2.5 flex justify-between text-xs font-semibold text-ink/60">
          <span>₦1,000</span>
          <span>Up to ₦{priceLimit.toLocaleString()}</span>
        </div>
      </FilterBlock>

      <FilterBlock title="Colour">
        <div className="flex flex-wrap gap-2.5">
          {SWATCHES.map((s) => (
            <button
              key={s.name}
              aria-label={s.name}
              onClick={() => onSwatchChange(swatch === s.name ? null : s.name)}
              style={{ background: s.color }}
              className={`relative h-7 w-7 rounded-full border-[1.5px] border-ink/[0.14] transition-transform hover:scale-110 ${
                swatch === s.name ? "ring-2 ring-orisirisi ring-offset-2" : ""
              }`}
            />
          ))}
        </div>
        <p className="mt-3 text-[11.5px] text-mist">Colour matching is coming soon — this is a preview.</p>
      </FilterBlock>

      {hasActiveFilters && (
        <button
          onClick={onClear}
          className="mt-5 text-xs font-bold uppercase tracking-wide text-orisirisi transition-opacity hover:opacity-70"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}

function FilterBlock({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-ink/[0.08] py-6 first:pt-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="mb-4 flex w-full items-center justify-between text-xs font-bold uppercase tracking-wide"
      >
        {title}
        <ChevronDown size={13} className={`transition-transform duration-300 ${open ? "" : "-rotate-90"}`} />
      </button>
      <div
        className={`grid transition-all duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

function Checkbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 shrink-0 cursor-pointer appearance-none rounded border-[1.5px] border-mist transition-colors checked:border-orisirisi checked:bg-orisirisi"
    />
  );
}
