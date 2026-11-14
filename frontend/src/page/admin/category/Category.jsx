import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  deleteCategory,
  getCategory,
} from "../../../service/categoryService.js";

import { useAlert } from "../../../UI/AlertModel.jsx";

import {
  FolderTree,
  Tags,
  Venus,
  Mars,
  Search,
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  LoaderCircle,
  RotateCw,
} from "lucide-react";

const Category = () => {
  const navigate = useNavigate();
  const alert = useAlert();
  const [category, setCategory] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    from: 0,
    to: 0,
  });

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");

  const [loading, setLoading] = useState(false);

  const loadCategory = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getCategory({ page, search });
      const body = response?.data ?? response;

      const rows = Array.isArray(body?.data)
        ? body.data
        : Array.isArray(body)
          ? body
          : [];

      setCategory(rows);

      setPagination({
        current_page: body?.current_page ?? page,
        last_page: body?.last_page ?? 1,
        total: body?.total ?? rows.length,
        from: body?.from ?? (rows.length ? 1 : 0),
        to: body?.to ?? rows.length,
      });
    } catch (error) {
      console.error(error);

      alert.error({
        title: "Could not load categories",
        message: error?.response?.data?.message ?? "Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }, [alert, page, search]);

  useEffect(() => {
    loadCategory();
  }, [loadCategory]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const categoryRows = useMemo(() => {
    const categoriesById = new Map(
      category.map((item) => [String(item.id), item]),
    );
    const nestedVisited = new Set();
    const addNestedCategories = (item) => {
      const itemId = String(item.id);
      if (nestedVisited.has(itemId)) return;
      nestedVisited.add(itemId);

      if (item.parent) {
        const parentId = String(item.parent.id);
        if (!categoriesById.has(parentId)) {
          categoriesById.set(parentId, item.parent);
        }
        addNestedCategories(item.parent);
      }

      (item.children ?? []).forEach((child) => {
        const childId = String(child.id);
        if (!categoriesById.has(childId)) {
          categoriesById.set(childId, child);
        }
        addNestedCategories(child);
      });
    };
    category.forEach(addNestedCategories);

    const allCategories = Array.from(categoriesById.values());
    const rows = [];
    const visited = new Set();

    const addChildren = (parentId, level) => {
      allCategories
        .filter(
          (item) => String(item.parent_id ?? "") === String(parentId ?? ""),
        )
        .forEach((item) => {
          const itemId = String(item.id);
          if (visited.has(itemId)) return;

          visited.add(itemId);
          rows.push({ ...item, level });
          addChildren(item.id, level + 1);
        });
    };

    addChildren(null, 0);

    allCategories.forEach((item) => {
      const itemId = String(item.id);
      if (!visited.has(itemId)) {
        visited.add(itemId);
        rows.push({ ...item, level: item.parent_id ? 1 : 0 });
        addChildren(item.id, item.parent_id ? 2 : 1);
      }
    });

    return rows;
  }, [category]);

  const filteredCategories = useMemo(() => {
    if (genderFilter === "all") {
      return categoryRows;
    }

    const matching = categoryRows.filter(
      (item) => item.gender === genderFilter,
    );
    const visibleIds = new Set(matching.map((item) => String(item.id)));

    matching.forEach((item) => {
      let parentId = item.parent_id;
      const visitedParents = new Set();
      while (
        parentId != null &&
        !visitedParents.has(String(parentId))
      ) {
        visitedParents.add(String(parentId));
        visibleIds.add(String(parentId));
        parentId = categoryRows.find(
          (categoryItem) => String(categoryItem.id) === String(parentId),
        )?.parent_id;
      }
    });

    return categoryRows.filter((item) => visibleIds.has(String(item.id)));
  }, [categoryRows, genderFilter]);

  const visibleCategories = useMemo(
    () =>
      filteredCategories.filter((item) => {
        let parentId = item.parent_id;
        const visitedParents = new Set();
        while (
          parentId != null &&
          !visitedParents.has(String(parentId))
        ) {
          visitedParents.add(String(parentId));
          if (!expandedCategories.has(String(parentId))) return false;
          parentId = categoryRows.find(
            (categoryItem) => String(categoryItem.id) === String(parentId),
          )?.parent_id;
        }
        return true;
      }),
    [categoryRows, expandedCategories, filteredCategories],
  );

  const genderCounts = useMemo(
    () => ({
      women: category.filter((item) => item.gender === "women").length,
      men: category.filter((item) => item.gender === "men").length,
      unisex: category.filter((item) => item.gender === "unisex").length,
    }),
    [category],
  );

  const openEdit = (item) => {
    navigate(`/admin/category/${item.id}/edit`, {
      state: { category: item },
    });
  };

  const handleDelete = async (item) => {
    const confirmed = await alert.confirm({
      title: "Delete this category?",
      message: "This category will be permanently deleted.",
      detail: item.name,
      confirmText: "Yes, delete",
    });

    if (!confirmed) return;

    try {
      await deleteCategory(item.id);

      await alert.success({
        title: "Category deleted!",
        duration: 1500,
      });

      await loadCategory();
    } catch (error) {
      console.error(error);

      alert.error({
        title: "Delete failed",
        message: error?.response?.data?.message ?? "Something went wrong.",
      });
    }
  };

  const genderStyle = (gender) => {
    if (gender === "women") return "bg-pink-50 text-pink-700";
    if (gender === "men") return "bg-blue-50 text-blue-700";
    return "bg-slate-100 text-slate-600";
  };

  return (
    <div className="min-w-0 space-y-6 p-5 lg:p-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-[10px] font-medium uppercase tracking-widest text-slate-400">
            Administration / Categories
          </p>

          <h1 className="font-serif text-3xl tracking-tight text-slate-900 sm:text-4xl">
            Categories
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
            Organize your products into parent categories and subcategories for
            women, men, and unisex collections.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/admin/category/create")}
          className="flex items-center gap-2 rounded-lg bg-[#102334] px-4 py-3 text-xs font-semibold text-white transition hover:bg-slate-800"
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: "Total Categories",
            value: pagination.total,
            description: "Categories in your inventory",
            Icon: FolderTree,
            color: "bg-slate-100 text-slate-700",
          },
          {
            title: "Women Categories",
            value: genderCounts.women,
            description: "Women's collections",
            Icon: Venus,
            color: "bg-pink-50 text-pink-600",
          },
          {
            title: "Men Categories",
            value: genderCounts.men,
            description: "Men's collections",
            Icon: Mars,
            color: "bg-blue-50 text-blue-600",
          },
          {
            title: "Unisex Categories",
            value: genderCounts.unisex,
            description: "Shared collections",
            Icon: Tags,
            color: "bg-emerald-50 text-emerald-700",
          },
        ].map(({ title, value, description, Icon, color }) => (
          <div
            key={title}
            className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                  {title}
                </p>
                <p className="mt-3 font-serif text-3xl text-slate-900">
                  {value}
                </p>
              </div>

              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}
              >
                <Icon size={20} />
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-500">{description}</p>
          </div>
        ))}
      </div>

      {/* CATEGORY TABLE */}
      <section className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-5">
          <div>
            <h2 className="font-serif text-2xl text-slate-900">
              All Categories
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Manage your category hierarchy.
            </p>
          </div>

          <button
            type="button"
            onClick={loadCategory}
            disabled={loading}
            className="flex items-center gap-2 text-xs text-slate-500 hover:text-emerald-700"
          >
            <RotateCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* SEARCH + FILTER */}
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search category name or slug..."
              className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-xs outline-none focus:border-emerald-600"
            />
          </div>

          <div className="relative">
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-9 text-xs outline-none focus:border-emerald-600 sm:w-40"
            >
              <option value="all">All Genders</option>
              <option value="women">Women</option>
              <option value="men">Men</option>
              <option value="unisex">Unisex</option>
            </select>

            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-slate-50">
              <tr className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-5 py-4">#</th>
                <th className="px-4 py-4">Category</th>
                <th className="px-4 py-4">Slug</th>
                <th className="px-4 py-4">Gender</th>
                <th className="px-4 py-4">Parent Category</th>
                <th className="px-4 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <LoaderCircle
                      size={24}
                      className="mx-auto animate-spin text-emerald-700"
                    />
                    <p className="mt-3 text-xs text-slate-500">
                      Loading categories...
                    </p>
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <FolderTree size={28} className="mx-auto text-slate-300" />
                    <p className="mt-3 text-sm font-medium text-slate-600">
                      No categories found
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Try another search or create a category.
                    </p>
                  </td>
                </tr>
              ) : (
                visibleCategories.map((item, index) => {
                  const parent = categoryRows.find(
                    (cat) => String(cat.id) === String(item.parent_id),
                  );
                  const hasChildren = categoryRows.some(
                    (cat) => String(cat.parent_id) === String(item.id),
                  );
                  const isExpanded = expandedCategories.has(String(item.id));

                  return (
                    <tr
                      key={item.id}
                      className="transition hover:bg-slate-50/80"
                    >
                      <td className="px-5 py-4 text-xs text-slate-400">
                        {(pagination.from || 1) + index}
                      </td>

                      <td className="px-4 py-4">
                        <div
                          className="flex items-center gap-2"
                          style={{
                            paddingLeft: `${item.level * 22}px`,
                          }}
                        >
                          <button
                            type="button"
                            disabled={!hasChildren}
                            onClick={() =>
                              setExpandedCategories((current) => {
                                const next = new Set(current);
                                const itemId = String(item.id);
                                if (next.has(itemId)) next.delete(itemId);
                                else next.add(itemId);
                                return next;
                              })
                            }
                            aria-label={`${isExpanded ? "Collapse" : "Expand"} ${item.name}`}
                            aria-expanded={hasChildren ? isExpanded : undefined}
                            className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:invisible"
                          >
                            {isExpanded ? (
                              <ChevronDown size={15} />
                            ) : (
                              <ChevronRight size={15} />
                            )}
                          </button>
                          {item.level > 0 ? (
                            <span className="text-slate-400">↳</span>
                          ) : (
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                              <FolderTree size={17} />
                            </div>
                          )}

                          <div>
                            <p className="text-xs font-semibold text-slate-800">
                              {item.name}
                            </p>
                            <p className="mt-1 text-[10px] text-slate-400">
                              {item.parent_id
                                ? "Subcategory"
                                : "Parent category"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-xs text-slate-500">
                        {item.slug}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-medium capitalize ${genderStyle(item.gender)}`}
                        >
                          {item.gender || "unisex"}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-xs text-slate-500">
                        {parent?.name ??
                          (item.parent_id ? "Parent not on this page" : "—")}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(item)}
                            title="Edit category"
                            className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-700"
                          >
                            <Pencil size={14} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(item)}
                            title="Delete category"
                            className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4">
          <p className="text-xs text-slate-500">
            Showing {pagination.from}–{pagination.to} of {pagination.total}{" "}
            categories
          </p>

          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1 || loading}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft size={15} />
            </button>

            <span className="rounded-lg bg-[#102334] px-3 py-2 text-xs font-semibold text-white">
              {pagination.current_page}
            </span>

            <button
              disabled={page >= pagination.last_page || loading}
              onClick={() =>
                setPage((prev) => Math.min(pagination.last_page, prev + 1))
              }
              className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Category;
