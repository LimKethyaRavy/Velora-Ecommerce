import React, { useState } from "react";
import { Pencil, Trash2, PackageOpen } from "lucide-react";

const money = (value) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    Number(value || 0),
  );

export default function ProductTable({ products, loading, onEdit, onDelete }) {
  if (loading)
    return (
      <div className="p-12 text-center text-sm text-slate-500">
        Loading products...
      </div>
    );
  if (!products.length)
    return (
      <div className="flex flex-col items-center gap-2 p-16 text-slate-500">
        <PackageOpen size={34} />
        <p className="font-medium">No products found</p>
        <p className="text-sm">Try another search or filter.</p>
      </div>
    );

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[850px] text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-5 py-4">Product</th>
            <th className="px-5 py-4">Category</th>
            <th className="px-5 py-4">Price</th>
            <th className="px-5 py-4">Stock</th>
            <th className="px-5 py-4">Status</th>
            <th className="px-5 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {products.map((product) => {
            const variants = product.product_variant ?? [];
            const stock = variants.reduce(
              (sum, v) => sum + Number(v.stock_quantity || 0),
              0,
            );
            const primary =
              product.primary_image ??
              product.product_image?.find((i) => i.is_primary) ??
              product.product_image?.[0];
            // image_url must be a public/signed URL, not a private S3 object key.
            const src =
              primary?.public_url ??
              (primary?.image_url?.startsWith("http")
                ? primary.image_url
                : null);
            return (
              <tr key={product.id} className="hover:bg-slate-50/70">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    {src ? (
                      <img
                        src={src}
                        alt={product.name}
                        className="h-12 w-12 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                        <PackageOpen size={20} />
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="max-w-56 truncate font-semibold text-slate-900">
                        {product.name}
                      </div>
                      <div className="max-w-56 truncate text-xs text-slate-400">
                        {product.slug}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-slate-600">
                  {product.category?.name ?? "—"}
                </td>
                <td className="px-5 py-4 font-semibold text-slate-900">
                  {money(product.base_price)}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={
                      stock <= 5
                        ? "font-medium text-amber-600"
                        : "text-slate-600"
                    }
                  >
                    {stock}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${product.is_active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}
                  >
                    {product.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(product)}
                      aria-label={`Edit ${product.name}`}
                      className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-violet-50 hover:text-violet-700"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(product)}
                      aria-label={`Delete ${product.name}`}
                      className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
