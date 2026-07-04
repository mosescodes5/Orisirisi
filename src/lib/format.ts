const nairaFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export function formatNaira(amount: number) {
  return nairaFormatter.format(amount);
}

export function formatBlogDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", { month: "long", day: "numeric", year: "numeric" });
}
