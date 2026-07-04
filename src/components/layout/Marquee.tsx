const ITEMS = ["Household Items", "Jewelry", "Clothing & Accessories", "Home Décor", "New Arrivals Weekly"];

export function Marquee() {
  const loop = [...ITEMS, ...ITEMS];
  return (
    <div className="group overflow-hidden whitespace-nowrap bg-ink text-paper">
      <div className="animate-marquee group-hover:[animation-play-state:paused] inline-flex">
        {loop.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-7 px-7 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] after:content-['◆'] after:text-[8px] after:text-orisirisi"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
