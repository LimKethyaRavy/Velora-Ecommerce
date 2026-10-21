import { useMemo, useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  User,
  Plus,
  Eye,
  Pencil,
  Trash2,
  X,
  Mail,
  Phone,
  MapPin,
  Truck,
  UsersRound,
} from "lucide-react";

/* ---------- constants ---------- */
const PAGE_SIZE = 10;

const EMPTY_FORM = {
  name: "",
  contactName: "",
  email: "",
  phone: "",
  address: "",
  isActive: true,
};

const inputCls =
  "w-full rounded-lg border border-neutral-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none placeholder:text-neutral-400 focus:border-neutral-900";

/* ---------- small pieces ---------- */
function StatCard({ icon: Icon, dot, label, value, caption }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6">
      <div className="flex items-center gap-2.5 text-[12px] font-medium uppercase tracking-wider text-neutral-700">
        {dot ? (
          <span className={`h-2 w-2 rounded-full ${dot}`} />
        ) : (
          <Icon size={16} strokeWidth={1.6} />
        )}
        {label}
      </div>
      <p className="mt-4 font-serif text-[40px] font-semibold leading-none">{value}</p>
      <p className="mt-4 text-[13px] text-neutral-500">{caption}</p>
    </div>
  );
}

function StatusBadge({ active }) {
  return (
    <span
      className={[
        "inline-flex rounded-full px-3 py-1 text-xs font-medium",
        active ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600",
      ].join(" ")}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function Field({ label, required, icon: Icon, children }) {
  return (
    <div>
      <label className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-neutral-800">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      <div className="relative">
        <Icon size={16} className="absolute left-3.5 top-[13px] text-neutral-500" />
        {children}
      </div>
    </div>
  );
}

/* ---------- drawer ---------- */
function SupplierDrawer({ open, form, setForm, editing, onClose, onSave }) {
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-black/20 transition-opacity xl:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      {/* top-16 = height of your navbar; change it if your navbar is a different height */}
      <aside
        className={[
          "fixed right-0 top-16 z-40 flex h-[calc(100%-4rem)] w-full max-w-[400px] flex-col border-l border-neutral-200 bg-white shadow-xl transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
        aria-hidden={!open}
      >
        <div className="flex items-start justify-between px-6 pt-8">
          <div>
            <h2 className="font-serif text-[26px] font-medium leading-tight">
              {editing ? "Edit Supplier" : "Add New Supplier"}
            </h2>
            <p className="mt-1 text-sm text-neutral-600">
              Fill in the supplier details below
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="mt-1 text-neutral-700 hover:text-neutral-950"
          >
            <X size={20} strokeWidth={1.6} />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave();
          }}
          className="flex flex-1 flex-col overflow-y-auto"
        >
          <div className="flex-1 space-y-5 px-6 py-8">
            <Field label="Supplier name" required icon={User}>
              <input
                required
                value={form.name}
                onChange={set("name")}
                placeholder="Enter supplier name"
                className={inputCls}
              />
            </Field>
            <Field label="Contact name" required icon={User}>
              <input
                required
                value={form.contactName}
                onChange={set("contactName")}
                placeholder="Enter contact person name"
                className={inputCls}
              />
            </Field>
            <Field label="Email" required icon={Mail}>
              <input
                required
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="Enter email address"
                className={inputCls}
              />
            </Field>
            <Field label="Phone" required icon={Phone}>
              <input
                required
                value={form.phone}
                onChange={set("phone")}
                placeholder="Enter phone number"
                className={inputCls}
              />
            </Field>
            <Field label="Address" required icon={MapPin}>
              <textarea
                required
                rows={3}
                value={form.address}
                onChange={set("address")}
                placeholder="Enter full address"
                className={`${inputCls} resize-y`}
              />
            </Field>

            <div>
              <p className="mb-3 text-[11px] font-medium uppercase tracking-wider text-neutral-800">
                Is active
              </p>
              <button
                type="button"
                role="switch"
                aria-checked={form.isActive}
                onClick={() => setForm({ ...form, isActive: !form.isActive })}
                className="flex items-center gap-3"
              >
                <span
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    form.isActive ? "bg-neutral-950" : "bg-neutral-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
                      form.isActive ? "left-[22px]" : "left-0.5"
                    }`}
                  />
                </span>
                <span className="text-sm">{form.isActive ? "Active" : "Inactive"}</span>
              </button>
            </div>
          </div>

          <div className="space-y-3 border-t border-neutral-200 px-6 py-6">
            <button
              type="submit"
              className="w-full rounded-lg bg-neutral-950 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
            >
              Save Supplier
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-lg border border-neutral-300 bg-white py-3 text-sm font-semibold hover:bg-neutral-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </aside>
    </>
  );
}


export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const total = suppliers.length;
  const activeCount = suppliers.filter((s) => s.isActive).length;
  const inactiveCount = total - activeCount;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return suppliers.filter((s) => {
      const matchesText =
        !q ||
        [s.name, s.contactName, s.email, s.phone].some((v) =>
          String(v || "").toLowerCase().includes(q)
        );
      const matchesStatus =
        status === "all" || (status === "active" ? s.isActive : !s.isActive);
      return matchesText && matchesStatus;
    });
  }, [suppliers, query, status]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const start = (safePage - 1) * PAGE_SIZE;
  const rows = filtered.slice(start, start + PAGE_SIZE);

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setDrawerOpen(true);
  };

  const openEdit = (supplier) => {
    setEditingId(supplier.id);
    setForm({ ...EMPTY_FORM, ...supplier });
    setDrawerOpen(true);
  };

  const closeDrawer = () => setDrawerOpen(false);

  const handleSave = () => {
    if (editingId) {
      setSuppliers((prev) =>
        prev.map((s) => (s.id === editingId ? { ...s, ...form } : s))
      );
    } else {
      setSuppliers((prev) => [...prev, { ...form, id: crypto.randomUUID() }]);
    }
    closeDrawer();
  };

  const handleDelete = (id) =>
    setSuppliers((prev) => prev.filter((s) => s.id !== id));

  const resetFilters = () => {
    setQuery("");
    setStatus("all");
    setPage(1);
  };

  return (
    <>
      <div
        className={`px-8 py-6 transition-[margin] duration-300 ${
          drawerOpen ? "xl:mr-[400px]" : ""
        }`}
      >

        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-neutral-700">
              <span className="h-2 w-2 rounded-full bg-emerald-600" />
              Suppliers
            </p>
            <h2 className="mt-1 font-serif text-[46px] font-medium leading-tight">
              Suppliers
            </h2>
            <p className="mt-1 text-[15px] text-neutral-700">
              Manage your suppliers and their information
            </p>
          </div>
          <button
            onClick={openAdd}
            className="mt-6 flex items-center gap-2 rounded-full bg-neutral-950 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-neutral-800"
          >
            <Plus size={16} />
            Add Supplier
          </button>
        </div>

   
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <StatCard
            icon={UsersRound}
            label="Total Suppliers"
            value={total}
            caption="All suppliers in your system"
          />
          <StatCard
            dot="bg-emerald-600"
            label="Active Suppliers"
            value={activeCount}
            caption="Currently active"
          />
          <StatCard
            dot="bg-red-500"
            label="Inactive Suppliers"
            value={inactiveCount}
            caption="Temporarily disabled"
          />
        </div>

   
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="relative min-w-[240px] flex-1">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"
            />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name, contact name, email, or phone..."
              className="h-11 w-full rounded-lg border border-neutral-200 bg-white pl-11 pr-3 text-sm outline-none placeholder:text-neutral-500 focus:border-neutral-400"
            />
          </div>

          <div className="relative w-[173px]">
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="h-11 w-full appearance-none rounded-lg border border-neutral-200 bg-white px-4 pr-9 text-sm outline-none focus:border-neutral-400"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500"
            />
          </div>

          <button
            onClick={resetFilters}
            className="h-11 px-4 text-sm font-medium hover:underline"
          >
            Reset
          </button>
        </div>

   
        <div className="mt-5 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] text-left text-[13px]">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-neutral-600">
                  <th className="px-6 py-5 font-medium">#</th>
                  <th className="py-5 pr-4 font-medium">Name</th>
                  <th className="py-5 pr-4 font-medium">Contact Name</th>
                  <th className="py-5 pr-4 font-medium">Email</th>
                  <th className="py-5 pr-4 font-medium">Phone</th>
                  <th className="py-5 pr-4 font-medium">Address</th>
                  <th className="py-5 pr-4 font-medium">Status</th>
                  <th className="py-5 pr-6 font-medium">Actions</th>
                </tr>
              </thead>

              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-20 text-center">
                      <div className="mx-auto flex max-w-xs flex-col items-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
                          <Truck size={22} strokeWidth={1.5} />
                        </div>
                        <p className="mt-4 text-sm font-semibold">
                          {total === 0
                            ? "No suppliers yet"
                            : "No suppliers match your search"}
                        </p>
                        <p className="mt-1 text-sm text-neutral-500">
                          {total === 0
                            ? "Add your first supplier to start tracking contacts and status."
                            : "Try a different keyword or reset the filters."}
                        </p>
                        {total === 0 && (
                          <button
                            onClick={openAdd}
                            className="mt-5 flex items-center gap-2 rounded-full bg-neutral-950 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-neutral-800"
                          >
                            <Plus size={14} />
                            Add Supplier
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  rows.map((s, i) => (
                    <tr
                      key={s.id}
                      className="border-t border-neutral-100 hover:bg-neutral-50/70"
                    >
                      <td className="px-6 py-4">{start + i + 1}</td>
                      <td className="py-4 pr-4 font-medium">{s.name}</td>
                      <td className="py-4 pr-4">{s.contactName}</td>
                      <td className="py-4 pr-4">{s.email}</td>
                      <td className="whitespace-nowrap py-4 pr-4">{s.phone}</td>
                      <td className="py-4 pr-4">{s.address}</td>
                      <td className="py-4 pr-4">
                        <StatusBadge active={s.isActive} />
                      </td>
                      <td className="py-4 pr-6">
                        <div className="flex items-center gap-4 text-neutral-600">
                          <button
                            aria-label="View supplier"
                            className="hover:text-neutral-950"
                          >
                            <Eye size={16} strokeWidth={1.6} />
                          </button>
                          <button
                            aria-label="Edit supplier"
                            onClick={() => openEdit(s)}
                            className="hover:text-neutral-950"
                          >
                            <Pencil size={16} strokeWidth={1.6} />
                          </button>
                          <button
                            aria-label="Delete supplier"
                            onClick={() => handleDelete(s.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={16} strokeWidth={1.6} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-neutral-100 px-6 py-5">
            <p className="text-xs text-neutral-600">
              Showing {filtered.length === 0 ? 0 : start + 1}–
              {Math.min(start + PAGE_SIZE, filtered.length)} of {filtered.length}{" "}
              suppliers
            </p>
            <div className="flex items-center gap-2">
              <button
                aria-label="Previous page"
                disabled={safePage === 1}
                onClick={() => setPage(safePage - 1)}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-neutral-200 disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: pageCount }, (_, n) => n + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`h-8 w-8 rounded-md text-xs font-semibold ${
                    n === safePage
                      ? "bg-neutral-950 text-white"
                      : "border border-neutral-200 hover:bg-neutral-50"
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                aria-label="Next page"
                disabled={safePage === pageCount}
                onClick={() => setPage(safePage + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-neutral-200 disabled:opacity-40"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <SupplierDrawer
        open={drawerOpen}
        form={form}
        setForm={setForm}
        editing={Boolean(editingId)}
        onClose={closeDrawer}
        onSave={handleSave}
      />
    </>
  );
}