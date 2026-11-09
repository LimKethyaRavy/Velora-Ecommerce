import React, { useEffect, useState } from "react";
import { ArrowLeft, ImagePlus, Plus, Trash2, X } from "lucide-react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { createProduct, updateProduct } from "../../service/productService";

let nextVariantKey = 0;

/* ---------- Design tokens ----------
   ink      #1f1b2d   text
   muted    #6b6880   secondary text
   line     #e4e1ec   borders
   canvas   #f4f3f8   page background
   accent   #5b2d8e   primary action / focus
------------------------------------ */

const fieldClass =
  "mt-1.5 w-full rounded-md border border-[#e4e1ec] bg-white px-3 py-2.5 text-sm text-[#1f1b2d] " +
  "placeholder:text-[#a9a6b8] outline-none transition " +
  "focus:border-[#5b2d8e] focus:ring-2 focus:ring-[#5b2d8e]/15";

const labelClass = "block text-sm font-medium text-[#1f1b2d]";

const emptyVariant = () => ({
  clientKey: `variant-${++nextVariantKey}`,
  sku: "",
  size: "",
  color: "",
  price: "",
  stock_quantity: "",
});

const normalizeProduct = (product = {}) => {
  const source = product ?? {};
  const productVariants =
    source.product_variants ?? source.product_variant ?? source.variants ?? [];

  return {
    category_id: source.category_id ?? source.category?.id ?? "",
    supplier_id: source.supplier_id ?? source.supplier?.id ?? "",
    name: source.name ?? "",
    slug: source.slug ?? "",
    description: source.description ?? "",
    base_price: source.base_price ?? "",
    is_active: source.is_active ?? true,

    product_variants:
      Array.isArray(productVariants) && productVariants.length > 0
        ? productVariants.map((variant) => ({
            clientKey: `variant-${++nextVariantKey}`,
            ...(variant.id != null ? { id: variant.id } : {}),
            sku: variant.sku ?? "",
            size: variant.size ?? "",
            color: variant.color ?? "",
            price: variant.price ?? "",
            stock_quantity: variant.stock_quantity ?? "",
          }))
        : [emptyVariant()],
    images: [],
  };
};

const VARIANT_FIELDS = [
  { key: "sku", label: "SKU", type: "text" },
  { key: "size", label: "Size", type: "text" },
  { key: "color", label: "Color", type: "text" },
  { key: "price", label: "Price", type: "number" },
  { key: "stock_quantity", label: "In stock", type: "number" },
];

const VARIANT_GRID =
  "grid grid-cols-2 gap-3 md:grid-cols-[1.3fr_0.8fr_1fr_0.9fr_0.9fr_36px] md:items-start";

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-600">{message}</p>;
}

function Section({ title, hint, action, children }) {
  return (
    <section className="px-6 py-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-[#1f1b2d]">{title}</h3>
          {hint && <p className="mt-0.5 text-sm text-[#6b6880]">{hint}</p>}
        </div>
        {action}
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

export default function ProductForm({
  onClose,
  onSuccess,
  categories = [],
  suppliers = [],
  initialValues = null,
  mode = "create",
  productId = null,
}) {
  const navigate = useNavigate();
  const goBack = () => navigate("/admin/products");
  const [form, setForm] = useState(() => normalizeProduct(initialValues));
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [previews, setPreviews] = useState([]);
  const [selectedImageVariantKey, setSelectedImageVariantKey] =
    useState("__general__");

  const [existingImages, setExistingImages] = useState(
    initialValues?.product_image ?? [],
  );
  const [removedImageIds, setRemovedImageIds] = useState([]);
  const [primaryImageId, setPrimaryImageId] = useState(
    initialValues?.primary_image?.id ??
      initialValues?.product_image?.find((image) => image.is_primary)?.id ??
      null,
  );

  useEffect(() => {
    setForm(normalizeProduct(initialValues));
    setExistingImages(initialValues?.product_image || []);
    setRemovedImageIds([]);
    setPrimaryImageId(
      initialValues?.primary_image?.id ??
        initialValues?.product_image?.find((image) => image.is_primary)?.id ??
        null,
    );
  }, [initialValues]);

  useEffect(() => {
    const urls = form.images.map(({ file }) => URL.createObjectURL(file));
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

  const handleImagesChange = (event, variantKey = null) => {
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
      images: [
        ...current.images,
        ...validFiles.map((file) => ({ file, variantKey })),
      ],
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
        Object.entries(variant)
          .filter(([key]) => key !== "clientKey")
          .forEach(([key, value]) => {
            formData.append(`product_variants[${index}][${key}]`, value);
          });
      });
      form.images.forEach(({ file, variantKey }, index) => {
        const variantIndex = form.product_variants.findIndex(
          (variant) => variant.clientKey === variantKey,
        );
        formData.append(`images[${index}]`, file);
        formData.append(
          `image_variant_indexes[${index}]`,
          variantIndex < 0 ? "" : String(variantIndex),
        );
      });
      removedImageIds.forEach((imageId, index) => {
        formData.append(`removed_image_ids[${index}]`, imageId);
      });
      if (primaryImageId != null) {
        formData.append("primary_image_id", primaryImageId);
      }

      const response =
        mode === "edit" && productId
          ? await updateProduct(productId, formData)
          : await createProduct(formData);

      if (response?.success === false) {
        throw new Error(
          response.message ||
            `Unable to ${mode === "edit" ? "update" : "create"} product`,
        );
      }

      await Swal.fire({
        icon: "success",
        title: mode === "edit" ? "Product updated" : "Product created",
        timer: 1600,
        showConfirmButton: false,
      });
      await onSuccess?.();
      navigate("/admin/products");
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors ?? {});
      }

      await Swal.fire({
        icon: "error",
        title: "Unable to save product",
        text:
          error.response?.data?.message ?? error.message ?? "Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const isEdit = mode === "edit";
  const submitLabel = saving
    ? "Saving…"
    : isEdit
      ? "Save changes"
      : "Create product";

  const colorGroups = form.product_variants.reduce((groups, variant, index) => {
    const color = String(variant.color || "").trim();
    const key = color.toLowerCase() || variant.clientKey;
    let group = groups.find((item) => item.key === key);

    if (!group) {
      group = {
        key,
        label: color || `Variant ${index + 1} (add a color)`,
        variantKey: variant.clientKey,
        variantKeys: [],
        variantIds: [],
      };
      groups.push(group);
    }

    group.variantKeys.push(variant.clientKey);
    if (variant.id != null) group.variantIds.push(variant.id);
    return groups;
  }, []);
  const selectedImageGroup = colorGroups.find(
    (group) => group.key === selectedImageVariantKey,
  );

  const imageGroups = [
    { key: "general", label: "General photos", variantKey: null },
    ...colorGroups,
  ];

  const actionButtons = (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={goBack}
        disabled={saving}
        className="rounded-md border border-[#e4e1ec] bg-white px-4 py-2.5 text-sm font-medium text-[#1f1b2d] transition hover:bg-[#f4f3f8] disabled:opacity-50"
      >
        Cancel
      </button>
      <button
        type="submit"
        form="product-form"
        disabled={saving}
        className="rounded-md bg-[#5b2d8e] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#4a2374] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5b2d8e] focus-visible:ring-offset-2 disabled:opacity-50"
      >
        {submitLabel}
      </button>
    </div>
  );

  return (
    <div className="min-h-full w-full bg-[#f4f3f8] px-4 py-6 text-[#1f1b2d] sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1400px]">
        <button
          type="button"
          onClick={goBack}
          className="inline-flex items-center gap-1.5 text-sm text-[#6b6880] transition hover:text-[#5b2d8e]"
        >
          <ArrowLeft size={16} /> Products
        </button>

        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">
              {isEdit ? "Edit product" : "New product"}
            </h2>
            <p className="mt-1.5 text-sm text-[#6b6880]">
              {isEdit
                ? "Changes appear in your Velora collection as soon as you save."
                : "Add the details, sizes and photos shoppers will see in your Velora collection."}
            </p>
          </div>
          {actionButtons}
        </div>

        <form
          id="product-form"
          onSubmit={handleSubmit}
          className="mt-6 grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_380px]"
        >
          {/* ---------- Main column ---------- */}
          <div className="divide-y divide-[#e4e1ec] rounded-lg border border-[#e4e1ec] bg-white">
            <Section
              title="Details"
              hint="What shoppers read on the product page."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <label className={labelClass}>
                  Product name
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleNameChange}
                    className={fieldClass}
                    placeholder="Linen wrap dress"
                    required
                  />
                  <FieldError message={errors.name?.[0]} />
                </label>

                <label className={labelClass}>
                  Page address
                  <div className="mt-1.5 flex items-stretch overflow-hidden rounded-md border border-[#e4e1ec] bg-white focus-within:border-[#5b2d8e] focus-within:ring-2 focus-within:ring-[#5b2d8e]/15">
                    <span className="flex items-center bg-[#f4f3f8] px-3 text-sm text-[#6b6880]">
                      /products/
                    </span>
                    <input
                      name="slug"
                      value={form.slug}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 text-sm outline-none"
                      required
                    />
                  </div>
                  <FieldError message={errors.slug?.[0]} />
                </label>
              </div>

              <label className={labelClass}>
                Description
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className={fieldClass}
                  rows={5}
                  placeholder="Fabric, fit, and how to care for it"
                  required
                />
                <FieldError message={errors.description?.[0]} />
              </label>
            </Section>

            <Section
              title="Variants"
              hint="One row for each size and color you sell."
              action={
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
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-[#e4e1ec] px-3 py-2 text-sm font-medium text-[#5b2d8e] transition hover:border-[#5b2d8e] hover:bg-[#5b2d8e]/5"
                >
                  <Plus size={16} /> Add variant
                </button>
              }
            >
              {/* Column headings (desktop only) */}
              <div
                className={`${VARIANT_GRID} hidden text-xs font-medium text-[#6b6880] md:grid`}
                aria-hidden="true"
              >
                {VARIANT_FIELDS.map(({ key, label }) => (
                  <span key={key}>{label}</span>
                ))}
                <span />
              </div>

              <div className="space-y-4 md:space-y-3">
                {form.product_variants.map((variant, index) => (
                  <div
                    key={index}
                    className="rounded-md border border-[#e4e1ec] bg-[#fafafc] p-3 md:border-0 md:bg-transparent md:p-0"
                  >
                    <div className="mb-2 flex items-center justify-between md:hidden">
                      <span className="text-sm font-medium">
                        Variant {index + 1}
                      </span>
                    </div>

                    <div className={VARIANT_GRID}>
                      {VARIANT_FIELDS.map(({ key, label, type }) => (
                        <label
                          key={key}
                          className="text-xs font-medium text-[#6b6880]"
                        >
                          <span className="md:sr-only">{label}</span>
                          <input
                            type={type}
                            min={type === "number" ? "0" : undefined}
                            step={key === "price" ? "0.01" : undefined}
                            value={variant[key]}
                            onChange={(event) =>
                              handleVariantChange(
                                index,
                                key,
                                event.target.value,
                              )
                            }
                            className={`${fieldClass} md:mt-0`}
                            required
                          />
                          <FieldError
                            message={
                              errors[`product_variants.${index}.${key}`]?.[0]
                            }
                          />
                        </label>
                      ))}

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
                        className="col-span-2 flex h-[42px] items-center justify-center gap-1.5 rounded-md text-sm text-[#6b6880] transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-[#6b6880] md:col-span-1 md:mt-0 md:w-9"
                        aria-label={`Remove variant ${index + 1}`}
                      >
                        <Trash2 size={16} />
                        <span className="md:hidden">Remove</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          </div>

          {/* ---------- Side column ---------- */}
          <aside className="divide-y divide-[#e4e1ec] rounded-lg border border-[#e4e1ec] bg-white xl:sticky xl:top-6">
            <Section title="Visibility">
              <label className="flex cursor-pointer items-center justify-between gap-4">
                <span>
                  <span className="block text-sm font-medium">
                    {form.is_active
                      ? "Visible in the shop"
                      : "Hidden from the shop"}
                  </span>
                  <span className="block text-sm text-[#6b6880]">
                    {form.is_active
                      ? "Shoppers can find and buy this."
                      : "Only admins can see this."}
                  </span>
                </span>
                <span className="relative inline-flex shrink-0">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={form.is_active}
                    onChange={handleChange}
                    className="peer sr-only"
                  />
                  <span className="h-6 w-11 rounded-full bg-[#d4d0e0] transition peer-checked:bg-[#5b2d8e] peer-focus-visible:ring-2 peer-focus-visible:ring-[#5b2d8e]/40 peer-focus-visible:ring-offset-2" />
                  <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
                </span>
              </label>
            </Section>

            <Section title="Organization">
              <label className={labelClass}>
                Category
                <select
                  name="category_id"
                  value={form.category_id}
                  onChange={handleChange}
                  className={fieldClass}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <FieldError message={errors.category_id?.[0]} />
              </label>

              <label className={labelClass}>
                Supplier
                <select
                  name="supplier_id"
                  value={form.supplier_id}
                  onChange={handleChange}
                  className={fieldClass}
                  required
                >
                  <option value="">Select a supplier</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
                <FieldError message={errors.supplier_id?.[0]} />
              </label>

              <label className={labelClass}>
                Base price
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 mt-[3px] -translate-y-1/2 text-sm text-[#6b6880]">
                    $
                  </span>
                  <input
                    type="number"
                    name="base_price"
                    min="0"
                    step="0.01"
                    value={form.base_price}
                    onChange={handleChange}
                    className={`${fieldClass} pl-7`}
                    placeholder="0.00"
                    required
                  />
                </div>
                <FieldError message={errors.base_price?.[0]} />
              </label>
            </Section>

            <Section
              title="Photos"
              hint="Choose a color before uploading so each variant has its own photos. JPG, PNG or WEBP, up to 2MB each."
            >
              <div className="space-y-3">
                <div>
                  <p className="mb-2 text-xs font-medium text-[#6b6880]">
                    Upload photos for
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedImageVariantKey("__general__")}
                      aria-pressed={!selectedImageGroup}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                        !selectedImageGroup
                          ? "border-[#5b2d8e] bg-[#5b2d8e] text-white"
                          : "border-[#e4e1ec] bg-white text-[#6b6880] hover:border-[#5b2d8e]"
                      }`}
                    >
                      All colors
                    </button>
                    {colorGroups.map((group) => (
                      <button
                        key={group.key}
                        type="button"
                        onClick={() => setSelectedImageVariantKey(group.key)}
                        aria-pressed={selectedImageGroup?.key === group.key}
                        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                          selectedImageGroup?.key === group.key
                            ? "border-[#5b2d8e] bg-[#5b2d8e] text-white"
                            : "border-[#e4e1ec] bg-white text-[#6b6880] hover:border-[#5b2d8e]"
                        }`}
                      >
                        {group.label}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-[#6b6880]">
                  {selectedImageGroup
                    ? `New photos will be assigned to ${selectedImageGroup.label}.`
                    : "General photos are shown for every color."}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {existingImages.map((image) => (
                  <div
                    key={image.id}
                    className="relative aspect-[3/4] overflow-hidden rounded-md border border-[#e4e1ec] bg-[#f4f3f8]"
                  >
                    <img
                      src={image.image_url}
                      alt="Product photo"
                      className="h-full w-full object-cover"
                    />
                    {form.product_variants.find(
                      (variant) =>
                        String(variant.id) === String(image.variant_id),
                    )?.color && (
                      <span className="absolute right-9 top-1.5 rounded bg-[#5b2d8e]/90 px-2 py-0.5 text-[10px] font-medium text-white">
                        {
                          form.product_variants.find(
                            (variant) =>
                              String(variant.id) === String(image.variant_id),
                          )?.color
                        }
                      </span>
                    )}
                    <span className="absolute bottom-1.5 left-1.5 rounded bg-[#1f1b2d]/80 px-1.5 py-0.5 text-[11px] font-medium text-white">
                      {Number(primaryImageId) === Number(image.id)
                        ? "Cover"
                        : "Saved"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPrimaryImageId(image.id)}
                      className="absolute left-1.5 top-1.5 rounded bg-white/95 px-2 py-1 text-[11px] font-medium text-[#1f1b2d] shadow hover:text-[#5b2d8e]"
                      aria-pressed={Number(primaryImageId) === Number(image.id)}
                    >
                      Make cover
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setExistingImages((current) =>
                          current.filter((savedImage) => savedImage.id !== image.id),
                        );
                        setRemovedImageIds((current) =>
                          current.includes(image.id) ? current : [...current, image.id],
                        );
                        if (Number(primaryImageId) === Number(image.id)) {
                          const nextImage = existingImages.find(
                            (savedImage) => savedImage.id !== image.id,
                          );
                          setPrimaryImageId(nextImage?.id ?? null);
                        }
                      }}
                      className="absolute right-1.5 top-1.5 rounded-full bg-white p-1 text-[#1f1b2d] shadow transition hover:bg-red-50 hover:text-red-600"
                      aria-label="Remove saved photo"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}

                {previews.map((preview, index) => (
                  <div
                    key={preview}
                    className="relative aspect-[3/4] overflow-hidden rounded-md border border-[#e4e1ec] bg-[#f4f3f8]"
                  >
                    <img
                      src={preview}
                      alt={`Product photo ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                    {colorGroups.find((group) =>
                      group.variantKeys.includes(
                        form.images[index]?.variantKey,
                      ),
                    ) && (
                      <span className="absolute left-1.5 top-1.5 rounded bg-[#5b2d8e]/90 px-2 py-0.5 text-[10px] font-medium text-white">
                        {
                          colorGroups.find((group) =>
                            group.variantKeys.includes(
                              form.images[index]?.variantKey,
                            ),
                          )?.label
                        }
                      </span>
                    )}
                    {index === 0 && existingImages.length === 0 && !primaryImageId && (
                      <span className="absolute bottom-1.5 left-1.5 rounded bg-[#1f1b2d]/80 px-1.5 py-0.5 text-[11px] font-medium text-white">
                        Cover
                      </span>
                    )}
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
                      className="absolute right-1 top-1 rounded-full bg-white p-1 shadow transition hover:bg-red-50 hover:text-red-600"
                      aria-label={`Remove photo ${index + 1}`}
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}

                <label className="flex aspect-[3/4] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-md border border-dashed border-[#c9c3da] text-center text-xs text-[#6b6880] transition focus-within:border-[#5b2d8e] hover:border-[#5b2d8e] hover:bg-[#5b2d8e]/5 hover:text-[#5b2d8e]">
                  <ImagePlus size={22} />
                  <span className="px-1">
                    {previews.length === 0 ? "Add photos" : "Add more"}
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={(event) =>
                      handleImagesChange(
                        event,
                        selectedImageGroup?.variantKey ?? null,
                      )
                    }
                    className="sr-only"
                  />
                </label>
              </div>
              <FieldError message={errors.images?.[0]} />
            </Section>
          </aside>
        </form>

        {/* Bottom actions: part of the page, not fixed over the sidebar */}
        <div className="mt-6 flex justify-end">{actionButtons}</div>
      </div>
    </div>
  );
}
