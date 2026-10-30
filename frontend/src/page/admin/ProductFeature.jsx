import React, { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  ChevronLeft,
  ChevronRight,
  Layers3,
  Package,
  Plus,
  Search,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";
import { getProduct, deleteProduct } from "../../service/productService";
import { getCategory } from "../../service/categoryService";
import { getSupplier } from "../../service/supplierService";
import ProductTable from "../../components/admin-components/ProductTable";
import ProductForm from "../../components/admin-components/ProductForm";
export default function ProductFeature() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
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
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [modalOpen, setModal] = useState(false);

  useEffect(() => {
    let cancelled = false;

    Promise.all([getCategory(), getSupplier()])
      .then(([categoryResponse, supplierResponse]) => {
        if (cancelled) return;

        setCategories(
          Array.isArray(categoryResponse?.data) ? categoryResponse.data : [],
        );
        setSuppliers(
          Array.isArray(supplierResponse?.data) ? supplierResponse.data : [],
        );
      })
      .catch((error) => {
        if (!cancelled) {
          Swal.fire({
            icon: "error",
            title: "Could not load product options",
            text:
              error?.response?.data?.message ??
              error.message ??
              "Please try again.",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const loadProduct = useCallback(
    async (signal = { cancelled: false }) => {
      setLoading(true);
      try {
        const response = await getProduct({ page, search });
        if (signal.cancelled) return;
        if (response?.success === false)
          throw new Error(response.message || "Could not load products");
        // Controller returns { success: true, data: LaravelPaginator }
        const paginator = response?.data ?? response;
        const rows = Array.isArray(paginator?.data) ? paginator.data : [];
        setProducts(rows);
        setPagination({
          current_page: paginator.current_page ?? page,
          last_page: paginator.last_page ?? 1,
          total: paginator.total ?? rows.length,
          from: paginator.from ?? 0,
          to: paginator.to ?? 0,
        });
      } catch (error) {
        if (!signal.cancelled)
          Swal.fire({
            icon: "error",
            title: "Could not load products",
            text:
              error?.response?.data?.message ??
              error.message ??
              "Please try again.",
          });
      } finally {
        if (!signal.cancelled) setLoading(false);
      }
    },
    [page, search],
  );

  useEffect(() => {
    const signal = { cancelled: false };
    loadProduct(signal);
    return () => {
      signal.cancelled = true;
    };
  }, [loadProduct, refresh]);

  const handleDelete = async (product) => {
    if (product.is_active)
      return Swal.fire({
        icon: "info",
        title: "Deactivate this product first",
        text: "Your Laravel API prevents deleting active products.",
      });
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete product?",
      text: `Delete “${product.name}”? This cannot be undone.`,
      showCancelButton: true,
      confirmButtonText: "Delete product",
      confirmButtonColor: "#dc2626",
    });
    if (!result.isConfirmed) return;
    try {
      const response = await deleteProduct(product.id);
      if (response?.success === false)
        throw new Error(response.message || "Delete failed");
      await Swal.fire({
        icon: "success",
        title: "Product deleted",
        timer: 1500,
        showConfirmButton: false,
      });
      if (products.length === 1 && page > 1) setPage(page - 1);
      else setRefresh((v) => v + 1);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Delete failed",
        text:
          error?.response?.data?.message ??
          error.message ??
          "Please try again.",
      });
    }
  };

  // The controller currently supports category_id and supplier_id filters, but not status.
  // Status is therefore applied only to the CURRENT page; remove it or add backend support for global filtering.
  const shown =
    status === "all"
      ? products
      : products.filter((p) => Boolean(p.is_active) === (status === "active"));
  const activeOnPage = products.filter((p) => p.is_active).length;
  const lowStockOnPage = products.filter(
    (p) =>
      (p.product_variant ?? []).reduce(
        (n, v) => n + Number(v.stock_quantity || 0),
        0,
      ) <= 5,
  ).length;

  return (
    <div className="min-h-full bg-[#f8f9fc] p-4 font-sans text-slate-900 sm:p-6 xl:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-violet-600">
              Velora / Catalog
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Products & Inventory
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage your collection, availability, and product details.
            </p>
          </div>
          <button
            onClick={() => setModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-violet-700"
          >
            <Plus size={18} /> Add product
          </button>

          {modalOpen && (
            <ProductForm
              onClose={() => setModal(false)}
              onSuccess={loadProduct}
              categories={categories}
              suppliers={suppliers}
            />
          )}
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              label: "Total products",
              value: pagination.total,
              icon: Package,
              note: "Across all pages",
            },
            {
              label: "Active on this page",
              value: activeOnPage,
              icon: ShieldCheck,
              note: "Current page only",
            },
            {
              label: "Low stock on this page",
              value: lowStockOnPage,
              icon: Layers3,
              note: "5 units or fewer",
            },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">
                  {card.label}
                </span>
                <card.icon size={20} className="text-violet-600" />
              </div>
              <div className="mt-3 text-3xl font-bold">{card.value}</div>
              <div className="mt-1 text-xs text-slate-400">{card.note}</div>
            </div>
          ))}
        </div>
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-lg font-semibold">Product catalog</h2>
              <p className="mt-1 text-xs text-slate-500">
                Browse and manage your fashion products
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="relative block">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search products..."
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-violet-500 sm:w-64"
                />
              </label>
              <label className="relative flex items-center gap-2 rounded-xl border border-slate-200 px-3">
                <SlidersHorizontal size={16} className="text-slate-400" />
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="bg-transparent py-2.5 text-sm outline-none"
                >
                  <option value="all">All statuses</option>
                  <option value="active">Active (page)</option>
                  <option value="inactive">Inactive (page)</option>
                </select>
              </label>
            </div>
          </div>
          <ProductTable
            products={shown}
            loading={loading}
            onDelete={handleDelete}
            onEdit={() =>
              Swal.fire({
                icon: "info",
                title: "Edit product",
                text: "The edit form will be connected in Sprint 2.",
              })
            }
          />
          <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <span>
              Showing {pagination.from ?? 0}–{pagination.to ?? 0} of{" "}
              {pagination.total} products
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={loading || page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg border border-slate-200 p-2 disabled:opacity-40"
                aria-label="Previous page"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="px-2 font-medium text-slate-700">
                Page {pagination.current_page} of {pagination.last_page}
              </span>
              <button
                disabled={loading || page >= pagination.last_page}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border border-slate-200 p-2 disabled:opacity-40"
                aria-label="Next page"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
