import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Trash2 } from "lucide-react";
import { ProductForm } from "@/components/admin/ProductForm";
import { getProduct } from "@/lib/admin/queries";
import { updateProduct, deleteProduct } from "@/lib/admin/actions";

export const metadata: Metadata = { title: "Edit Product — Admin" };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return notFound();

  const updateWithId = updateProduct.bind(null, id);
  const deleteWithId = deleteProduct.bind(null, id);

  return (
    <div>
      <Link
        href="/admin/products"
        className="mb-4 inline-flex items-center gap-1.5 text-[12.5px] font-bold uppercase tracking-wide text-ink/50 hover:text-orisirisi"
      >
        <ChevronLeft size={14} /> Back to products
      </Link>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-[30px] font-medium sm:text-[36px]">{product.name}</h1>
        <form action={deleteWithId}>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full border border-red-600/30 px-5 py-3 text-[12.5px] font-bold uppercase tracking-wide text-red-600 transition-colors hover:bg-red-600 hover:text-paper"
          >
            <Trash2 size={14} /> Delete
          </button>
        </form>
      </div>

      <div className="max-w-3xl rounded-2xl border border-ink/[0.08] bg-paper p-6 sm:p-8">
        <ProductForm product={product} action={updateWithId} />
      </div>
    </div>
  );
}
