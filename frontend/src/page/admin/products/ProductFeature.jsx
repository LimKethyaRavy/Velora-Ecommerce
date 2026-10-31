

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  ChevronLeft, ChevronRight, Package, Plus, Search, ShieldCheck,
  AlertTriangle, Layers3, RefreshCw, X, ArrowUpRight,
} from "lucide-react";
import { getProduct, deleteProduct } from "../../../service/productService";
import ProductTable from "../../../components/admin-components/ProductTable";


const initialPagination = { current_page: 1, last_page: 1, total: 0, from: 0, to: 0 };

function StatCard({ label, value, hint, icon: Icon, color }) {
  const colors = {
    violet: "bg-violet-50 text-violet-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    slate: "bg-slate-100 text-slate-600",
  };
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
        </div>
        <span className={`rounded-xl p-3 ${colors[color]}`}><Icon size={21} /></span>
      </div>
      <p className="mt-3 text-xs text-slate-400">{hint}</p>
    </div>
  );
}

export default function ProductFeature() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(initialPagination);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const loadProducts = useCallback(async (signal) => {
    setLoading(true);
    try {
      const response = await getProduct({ page, search });
      if (signal.cancelled) return;
      if (response?.success === false) throw new Error(response.message || "Could not load products");
      // Existing API shape: { success: true, data: LaravelPaginator }
      const paginator = response?.data ?? response;
      const rows = Array.isArray(paginator?.data) ? paginator.data : [];
      setProducts(rows);
      setPagination({
        current_page: paginator?.current_page ?? page,
        last_page: paginator?.last_page ?? 1,
        total: paginator?.total ?? rows.length,
        from: paginator?.from ?? (rows.length ? 1 : 0),
        to: paginator?.to ?? rows.length,
      });
    } catch (error) {
      if (!signal.cancelled) {
        Swal.fire({
          icon: "error", title: "Could not load products",
          text: error?.response?.data?.message ?? error?.message ?? "Please try again.",
        });
      }
    } finally {
      if (!signal.cancelled) setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    const signal = { cancelled: false };
    loadProducts(signal);
    return () => { signal.cancelled = true; };
  }, [loadProducts, refresh]);

  const filteredProducts = useMemo(() => {
    if (status === "all") return products;
    return products.filter((p) => Boolean(p.is_active) === (status === "active"));
  }, [products, status]);

  const activeOnPage = products.filter((p) => Boolean(p.is_active)).length;
  const inactiveOnPage = products.length - activeOnPage;
  const lowStockOnPage = products.filter((p) => {
    const variants = p.product_variants ?? p.product_variant ?? p.variants;
    if (!Array.isArray(variants) || variants.length === 0) return false;
    const stock = variants.reduce((total, variant) => total + Number(variant.stock_quantity ?? 0), 0);
    return stock <= 5;
  }).length;

  const handleDelete = async (product) => {
    if (product.is_active) {
      await Swal.fire({
        icon: "info", title: "Deactivate this product first",
        text: "Your Laravel API prevents deleting active products.",
      });
      return;
    }
    const result = await Swal.fire({
      icon: "warning", title: "Delete product?",
      text: `Delete “${product.name}”? This cannot be undone.`,
      showCancelButton: true, confirmButtonText: "Delete product",
      confirmButtonColor: "#dc2626", reverseButtons: true,
    });
    if (!result.isConfirmed) return;
    try {
      const response = await deleteProduct(product.id);
      if (response?.success === false) throw new Error(response.message || "Delete failed");
      await Swal.fire({ icon: "success", title: "Product deleted", timer: 1300, showConfirmButton: false });
      if (products.length === 1 && page > 1) setPage((p) => p - 1);
      else setRefresh((v) => v + 1);
    } catch (error) {
      Swal.fire({
        icon: "error", title: "Delete failed",
        text: error?.response?.data?.message ?? error?.message ?? "Please try again.",
      });
    }
  };

  const resetFilters = () => { setSearchInput(""); setSearch(""); setStatus("all"); setPage(1); };

  return (
    <main className="min-h-full bg-[#f7f8fc] px-4 py-6 font-sans text-slate-900 sm:px-6 xl:px-8">
      <div className="mx-auto max-w-[1500px] space-y-6">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400">
              <span>Velora</span><ChevronRight size={13} /><span className="text-violet-600">Products</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-[32px]">Products</h1>
            <p className="mt-1.5 text-sm text-slate-500">Manage your fashion catalog, inventory, and availability.</p>
          </div>
          <button type="button" onClick={() => navigate("/admin/products/create")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-violet-200 transition hover:bg-violet-700">
            <Plus size={18} /> Add Product
          </button>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Product statistics">
          <StatCard label="Total products" value={pagination.total} hint="All matching products across pages" icon={Package} color="violet" />
          <StatCard label="Active products" value={activeOnPage} hint="On the current page" icon={ShieldCheck} color="emerald" />
          <StatCard label="Inactive products" value={inactiveOnPage} hint="On the current page" icon={Layers3} color="slate" />
          <StatCard label="Low stock" value={lowStockOnPage} hint="Current page · 5 units or fewer · variants loaded" icon={AlertTriangle} color="amber" />
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-bold">Product catalog</h2>
              <p className="mt-1 text-xs text-slate-500">Browse and manage products in your store</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label className="relative min-w-[190px] flex-1 sm:w-64 sm:flex-none">
                <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search products..." aria-label="Search products"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-9 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100" />
                {searchInput && <button type="button" aria-label="Clear search" onClick={() => setSearchInput("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"><X size={15} /></button>}
              </label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter status on current page"
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-500">
                <option value="all">All statuses</option>
                <option value="active">Active (page)</option>
                <option value="inactive">Inactive (page)</option>
              </select>
              <button type="button" onClick={resetFilters} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">Reset</button>
              <button type="button" onClick={() => setRefresh((v) => v + 1)} disabled={loading} aria-label="Refresh products"
                className="rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50 disabled:opacity-50">
                <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <ProductTable
              products={filteredProducts}
              loading={loading}
              onDelete={handleDelete}
              onEdit={(product) => navigate(`/admin/products/${product.id}/edit`)}
            />
          </div>
          {!loading && filteredProducts.length === 0 && (
            <div className="flex flex-col items-center gap-2 border-t border-slate-100 px-5 py-12 text-center">
              <Package size={28} className="text-slate-300" />
              <p className="font-semibold text-slate-700">No products found</p>
              <p className="text-sm text-slate-400">Try another search or status filter.</p>
            </div>
          )}
          <footer className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 text-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-slate-500">Showing <strong className="text-slate-800">{pagination.from ?? 0}–{pagination.to ?? 0}</strong> of <strong className="text-slate-800">{pagination.total}</strong> products</p>
            <div className="flex items-center gap-3">
              <button type="button" disabled={loading || page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}
                aria-label="Previous page" className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft size={18} /></button>
              <span className="text-sm font-medium text-slate-600">Page {pagination.current_page} of {pagination.last_page}</span>
              <button type="button" disabled={loading || page >= pagination.last_page} onClick={() => setPage((p) => p + 1)}
                aria-label="Next page" className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"><ChevronRight size={18} /></button>
            </div>
          </footer>
        </section>
        <p className="flex items-center gap-1 text-xs text-slate-400">Product management <ArrowUpRight size={12} /> Velora Admin</p>
      </div>
    </main>
  );
}
