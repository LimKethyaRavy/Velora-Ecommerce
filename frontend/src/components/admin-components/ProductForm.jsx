import React, { useEffect, useState } from "react";
import { Plus, Trash2, Upload, X } from "lucide-react";
import Swal from "sweetalert2";
import { createProduct } from "../../service/productService";

const inputClass =
  "w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100";

const emptyVariant = () => ({
  sku: "",
  size: "",
  color: "",
  price: "",
  stock_quantity: "",
});

const emptyForm = () => ({
  category_id: "",
  supplier_id: "",
  name: "",
  slug: "",
  description: "",
  base_price: "",
  is_active: true,
  product_variants: [emptyVariant()],
  images: [],
});

export default function ProductForm({
  onClose,
  onSuccess,
  categories = [],
  suppliers = [],
}) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    const urls = form.images.map((image) => URL.createObjectURL(image));
    setPreviews(urls);

    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [form.images]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNameChange = (event) => {
    const name = event.target.value;
    setForm((current) => ({
      ...current,
      name,
      slug: name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
    }));
  };

  const handleVariantChange = (index, field, value) => {
    setForm((current) => ({
      ...current,
      product_variants: current.product_variants.map((variant, variantIndex) =>
        variantIndex === index ? { ...variant, [field]: value } : variant,
      ),
    }));
  };

  const handleImagesChange = (event) => {
    const files = Array.from(event.target.files ?? []);
    const validFiles = files.filter(
      (file) =>
        ["image/jpeg", "image/png", "image/webp"].includes(file.type) &&
        file.size <= 2 * 1024 * 1024,
    );

    if (validFiles.length !== files.length) {
      Swal.fire({
        icon: "warning",
        title: "Some images were not added",
        text: "Use JPG, PNG, or WEBP images up to 2MB each.",
      });
    }

    setForm((current) => ({
      ...current,
      images: [...current.images, ...validFiles],
    }));
    event.target.value = "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setErrors({});

    try {
      const formData = new FormData();
      [
        "category_id",
        "supplier_id",
        "name",
        "slug",
        "description",
        "base_price",
      ].forEach((key) => formData.append(key, form[key]));

      formData.append("is_active", form.is_active ? "1" : "0");
      form.product_variants.forEach((variant, index) => {
        Object.entries(variant).forEach(([key, value]) => {
          formData.append(`product_variants[${index}][${key}]`, value);
        });
      });
      form.images.forEach((image, index) => {
        formData.append(`images[${index}]`, image);
      });

      const response = await createProduct(formData);
      if (response?.success === false) {
        throw new Error(response.message || "Unable to create product");
      }

      await Swal.fire({
        icon: "success",
        title: "Product created",
        timer: 1600,
        showConfirmButton: false,
      });
      await onSuccess?.();
      onClose?.();
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors ?? {});
      }

      await Swal.fire({
        icon: "error",
        title: "Unable to save product",
        text:
          error.response?.data?.message ??
          error.message ??
          "Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
      <div className="flex h-full w-full max-w-5xl flex-col bg-gray-50 shadow-2xl">
        <div className="flex items-center justify-between border-b bg-white px-6 py-5">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Add New Product
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Create a new item for your Velora collection.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100"
            aria-label="Close product form"
          >
            <X size={22} />
          </button>
        </div>

        <form
          id="product-form"
          onSubmit={handleSubmit}
          className="flex-1 space-y-6 overflow-y-auto p-6"
        >
          <section className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <label className="block text-sm font-medium">
              Product name
              <input
                name="name"
                value={form.name}
                onChange={handleNameChange}
                className={inputClass}
                required
              />
              {errors.name && (
                <span className="text-xs text-red-500">{errors.name[0]}</span>
              )}
            </label>
            <label className="block text-sm font-medium">
              Slug
              <input
                name="slug"
                value={form.slug}
                onChange={handleChange}
                className={inputClass}
                required
              />
              {errors.slug && (
                <span className="text-xs text-red-500">{errors.slug[0]}</span>
              )}
            </label>
            <label className="block text-sm font-medium">
              Description
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className={inputClass}
                rows={3}
                required
              />
              {errors.description && (
                <span className="text-xs text-red-500">
                  {errors.description[0]}
                </span>
              )}
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium">
                Category
                <select
                  name="category_id"
                  value={form.category_id}
                  onChange={handleChange}
                  className={inputClass}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-medium">
                Supplier
                <select
                  name="supplier_id"
                  value={form.supplier_id}
                  onChange={handleChange}
                  className={inputClass}
                  required
                >
                  <option value="">Select supplier</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="block text-sm font-medium">
              Base price
              <input
                type="number"
                name="base_price"
                min="0"
                step="0.01"
                value={form.base_price}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </label>
          </section>

          <section className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Product variants</h3>
              <button
                type="button"
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    product_variants: [
                      ...current.product_variants,
                      emptyVariant(),
                    ],
                  }))
                }
                className="flex items-center gap-2 text-sm font-medium text-violet-600"
              >
                <Plus size={16} /> Add variant
              </button>
            </div>
            {form.product_variants.map((variant, index) => (
              <div key={index} className="rounded-xl border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Variant {index + 1}
                  </span>
                  <button
                    type="button"
                    disabled={form.product_variants.length === 1}
                    onClick={() =>
                      setForm((current) => ({
                        ...current,
                        product_variants: current.product_variants.filter(
                          (_, variantIndex) => variantIndex !== index,
                        ),
                      }))
                    }
                    className="text-red-500 disabled:opacity-40"
                    aria-label={`Remove variant ${index + 1}`}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    ["sku", "SKU", "text"],
                    ["size", "Size", "text"],
                    ["color", "Color", "text"],
                    ["price", "Price", "number"],
                    ["stock_quantity", "Stock", "number"],
                  ].map(([field, label, type]) => (
                    <label key={field} className="text-xs text-gray-500">
                      {label}
                      <input
                        type={type}
                        min={type === "number" ? "0" : undefined}
                        step={field === "price" ? "0.01" : undefined}
                        value={variant[field]}
                        onChange={(event) =>
                          handleVariantChange(index, field, event.target.value)
                        }
                        className={inputClass}
                        required
                      />
                      {errors[`product_variants.${index}.${field}`] && (
                        <span className="text-red-500">
                          {errors[`product_variants.${index}.${field}`][0]}
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </section>

          <section className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold">Product images</h3>
            <label className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-violet-200 bg-violet-50 p-8 text-center">
              <Upload className="mb-3 text-violet-600" size={28} />
              <span className="text-sm font-medium">Choose images</span>
              <span className="mt-1 text-xs text-gray-500">
                JPG, PNG, or WEBP, up to 2MB each
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleImagesChange}
                className="hidden"
              />
            </label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {previews.map((preview, index) => (
                <div key={preview} className="relative">
                  <img
                    src={preview}
                    alt={`Product image ${index + 1}`}
                    className="h-28 w-full rounded-xl object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setForm((current) => ({
                        ...current,
                        images: current.images.filter(
                          (_, imageIndex) => imageIndex !== index,
                        ),
                      }))
                    }
                    className="absolute right-1 top-1 rounded-full bg-white p-1 shadow"
                    aria-label={`Remove image ${index + 1}`}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <label className="flex items-center justify-between rounded-xl bg-white p-4">
            <span className="text-sm text-gray-700">Active product</span>
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
              className="h-5 w-5 accent-violet-600"
            />
          </label>
        </form>

        <div className="flex justify-end gap-3 border-t bg-white px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl border px-5 py-3 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="product-form"
            disabled={saving}
            className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Product"}
          </button>
        </div>
      </div>
    </div>
  );
}
