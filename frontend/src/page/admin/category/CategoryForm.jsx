
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowLeft, FolderTree, LoaderCircle } from "lucide-react";

import {
  createCategory,
  getCategory,
  showCategory,
  updateCategory,
} from "../../../service/categoryService.js";

import { useAlert } from "../../../UI/AlertModel.jsx";

const CategoryForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const alert = useAlert();

  const isEdit = Boolean(id);

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    parent_id: "",
    gender: "unisex",
  });

  useEffect(() => {
    let active = true;

    const loadFormData = async () => {
      setLoading(true);
      setLoadError("");

      try {
        const firstResponse = await getCategory({ page: 1 });
        const firstPage = firstResponse?.data ?? firstResponse;
        const firstRows = Array.isArray(firstPage?.data)
          ? firstPage.data
          : Array.isArray(firstPage)
            ? firstPage
            : [];
        const lastPage = Number(firstPage?.last_page ?? 1);
        const remainingResponses = await Promise.all(
          Array.from({ length: Math.max(0, lastPage - 1) }, (_, index) =>
            getCategory({ page: index + 2 }),
          ),
        );
        const allCategories = [
          ...firstRows,
          ...remainingResponses.flatMap((response) => {
            const page = response?.data ?? response;
            return Array.isArray(page?.data) ? page.data : [];
          }),
        ];

        let item = location.state?.category;
        if (isEdit && !item) {
          const response = await showCategory(id);
          item = response?.data?.data ?? response?.data ?? response;
        }

        if (isEdit && !item) {
          throw new Error("Category not found.");
        }

        if (active) {
          setCategories(allCategories);
          if (isEdit) {
            setForm({
              name: item.name ?? "",
              slug: item.slug ?? "",
              parent_id: item.parent_id ?? "",
              gender: item.gender ?? "unisex",
            });
          } else {
            setForm({
              name: "",
              slug: "",
              parent_id: "",
              gender: "unisex",
            });
          }
        }
      } catch (error) {
        if (active) {
          setLoadError(
            error?.response?.data?.message ??
              error?.message ??
              "Could not load category information.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadFormData();
    return () => {
      active = false;
    };
  }, [id, isEdit, location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "name"
        ? {
            slug: value
              .toLowerCase()
              .trim()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, ""),
          }
        : {}),
    }));
  };

  const unavailableParentIds = new Set(isEdit ? [String(id)] : []);
  let hasNewDescendant = true;
  while (hasNewDescendant) {
    hasNewDescendant = false;
    categories.forEach((category) => {
      if (
        unavailableParentIds.has(String(category.parent_id)) &&
        !unavailableParentIds.has(String(category.id))
      ) {
        unavailableParentIds.add(String(category.id));
        hasNewDescendant = true;
      }
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.slug.trim()) {
      return alert.warning({
        title: "Required fields",
        message: "Please complete the category name and slug.",
      });
    }

    if (
      isEdit &&
      form.parent_id &&
      unavailableParentIds.has(String(form.parent_id))
    ) {
      return alert.warning({
        title: "Invalid parent",
        message: "Choose a category outside this category's hierarchy.",
      });
    }

    setSaving(true);

    try {
      const payload = {
        ...form,
        parent_id: form.parent_id || null,
      };

      if (isEdit) {
        await updateCategory(id, payload);
      } else {
        await createCategory(payload);
      }

      await alert.success({
        title: isEdit ? "Category updated!" : "Category created!",
        duration: 1500,
      });

      navigate("/admin/category");
    } catch (error) {
      alert.error({
        title: "Something went wrong",
        message:
          error?.response?.data?.message ?? "Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center gap-3 text-sm text-slate-500">
        <LoaderCircle size={20} className="animate-spin" />
        Loading category form...
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="p-5 lg:p-7">
        <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {loadError}
        </p>
        <button
          type="button"
          onClick={() => navigate("/admin/category")}
          className="mt-4 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          Back to Categories
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto min-w-0 w-full max-w-[1400px] space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

      <button
        onClick={() => navigate("/admin/category")}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft size={16} />
        Back to Categories
      </button>

      <div>
        <p className="text-[10px] uppercase tracking-widest text-slate-400">
          Administration / Categories
        </p>

        <h1 className="mt-2 font-serif text-3xl text-slate-900">
          {isEdit ? "Edit Category" : "Create Category"}
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Manage your product category information.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="w-full rounded-xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 p-6">
            <h2 className="font-semibold text-slate-800">
              Category Information
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Enter the details for this category.
            </p>
          </div>

          <div className="grid gap-5 p-6 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-xs font-medium">
                Category Name *
              </label>
              <input
                required
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Women's Clothing"
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium">
                Slug *
              </label>
              <input
                required
                name="slug"
                value={form.slug}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium">
                Parent Category
              </label>
              <select
                name="parent_id"
                value={form.parent_id}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-600"
              >
                <option value="">None (Parent Category)</option>
                {categories
                  .filter(
                    (category) =>
                      !unavailableParentIds.has(String(category.id)),
                  )
                  .map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium">
                Gender *
              </label>
              <select
                required
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-600"
              >
                <option value="women">Women</option>
                <option value="men">Men</option>
                <option value="unisex">Unisex</option>
              </select>
            </div>

          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 p-6">
            <button
              type="button"
              onClick={() => navigate("/admin/category")}
              className="rounded-lg border border-slate-200 px-5 py-3 text-xs"
            >
              Cancel
            </button>

            <button
              disabled={saving}
              type="submit"
              className="flex items-center gap-2 rounded-lg bg-[#102334] px-5 py-3 text-xs font-semibold text-white disabled:opacity-50"
            >
              {saving && <LoaderCircle size={15} className="animate-spin" />}
              {isEdit ? "Save Changes" : "Create Category"}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
