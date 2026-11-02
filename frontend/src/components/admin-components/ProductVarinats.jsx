import { Plus, Trash2 } from "lucide-react";

export const emptyVariant = () => ({
  sku: "",
  size: "",
  color: "",
  price: "",
  stock_quantity: "0",
});

export default function ProductVariants({ variants, onChange, errors = {} }) {
  const change = (index, key, value) =>
    onChange(
      variants.map((v, i) => (i === index ? { ...v, [key]: value } : v)),
    );
  const fields = [
    ["sku", "SKU", "text", "HENLEY-BLK-M"],
    ["size", "Size", "text", "M"],
    ["color", "Color", "text", "Black"],
    ["price", "Price ($)", "number", "29.99"],
    ["stock_quantity", "Stock", "number", "10"],
  ];
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Product variants
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Sizes, colors, SKUs, prices and inventory.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onChange([...variants, emptyVariant()])}
          className="inline-flex items-center gap-2 rounded-xl border border-violet-200 px-3 py-2 text-sm font-medium text-violet-700 hover:bg-violet-50"
        >
          <Plus size={16} /> Add variant
        </button>
      </div>
      <div className="mt-5 space-y-4">
        {variants.length === 0 && (
          <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
            No variants yet. Add one if your product has sizes or colors.
          </p>
        )}
        {variants.map((variant, index) => (
          <div
            key={index}
            className="rounded-xl border border-slate-200 bg-slate-50/60 p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-700">
                Variant {index + 1}
              </span>
              <button
                type="button"
                onClick={() => onChange(variants.filter((_, i) => i !== index))}
                className="text-red-500 hover:text-red-700"
                aria-label={`Remove variant ${index + 1}`}
              >
                <Trash2 size={17} />
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {fields.map(([key, label, type, placeholder]) => (
                <label
                  key={key}
                  className="block text-xs font-medium text-slate-600"
                >
                  {label}
                  <input
                    type={type}
                    min={type === "number" ? "0" : undefined}
                    step={
                      key === "price"
                        ? "0.01"
                        : key === "stock_quantity"
                          ? "1"
                          : undefined
                    }
                    value={variant[key]}
                    placeholder={placeholder}
                    onChange={(e) => change(index, key, e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-500"
                  />
                  {errors[`product_variants.${index}.${key}`] && (
                    <span className="mt-1 block text-xs text-red-600">
                      {errors[`product_variants.${index}.${key}`][0]}
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
