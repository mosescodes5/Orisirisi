import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil } from "lucide-react";
import { listProducts } from "@/lib/admin/queries";
import { formatNaira } from "@/lib/format";

export const metadata: Metadata = { title: "Products — Admin" };

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const products = await listProducts({ search: q });

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Catalog</p>
          <h1 className="mt-2 font-display text-[30px] font-medium sm:text-[36px]">Products</h1>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-full bg-secondary px-6 py-3.5 text-[12.5px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-orisirisi"
        >
          <Plus size={15} /> New Product
        </Link>
      </div>

      <form className="mb-6">
        <input
          type="text"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search products by name…"
          className="h-11 w-full max-w-sm rounded-full border-[1.5px] border-ink/[0.14] bg-paper px-4 text-[13.5px] focus:border-orisirisi focus:outline-none"
        />
      </form>

      <div className="overflow-hidden rounded-2xl border border-ink/[0.08] bg-paper">
        {products.length === 0 ? (
          <p className="px-6 py-14 text-center text-[14px] text-ink/50">
            No products yet — create your first one.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13.5px]">
              <thead>
                <tr className="border-b border-ink/[0.08] text-[11px] font-bold uppercase tracking-wide text-ink/45">
                  <th className="px-6 py-3">Product</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Price</th>
                  <th className="px-6 py-3">Stock</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-ink/[0.06] last:border-0 hover:bg-ink/[0.02]">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-[8px] bg-ink/[0.05]">
                          {p.image && (
                            <Image
                              src={`https://picsum.photos/seed/${p.image}/120/120`}
                              alt={p.name}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-semibold">{p.name}</p>
                          <p className="truncate text-[12px] text-ink/45">{p.subcategory}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-ink/70">{p.category}</td>
                    <td className="px-6 py-4 font-semibold">{formatNaira(p.price)}</td>
                    <td className="px-6 py-4 text-ink/70">{p.stock}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${
                          p.is_published ? "bg-green-600/[0.12] text-green-700" : "bg-ink/[0.06] text-ink/50"
                        }`}
                      >
                        {p.is_published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="inline-flex items-center gap-1.5 text-[12.5px] font-bold uppercase tracking-wide text-ink/60 transition-colors hover:text-orisirisi"
                      >
                        <Pencil size={13} /> Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
