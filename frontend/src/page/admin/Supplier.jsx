import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  createSupplier,
  deleteSupplier,
  getSupplier,
  updateSupplier,
} from "../../service/supplierService";

import {
  Plus,
  Search,
  RefreshCw,
  Pencil,
  Trash2,
  X,
  Users,
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Loader2,
} from "lucide-react";

const Supplier = () => {
  const emptyForm = {
    name: "",
    contact_name: "",
    email: "",
    phone: "",
    address: "",
    is_active: true,
  };

  const [suppliers, setSuppliers] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
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
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const loadSupplier = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getSupplier({
        page,
        search,
        status: status === "all" ? undefined : status,
      });

      const rows = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
          ? response
          : [];

      setSuppliers(rows);

      setPagination({
        currentPage: 1,
        last_page: 1,
        total: rows.length,
        from: rows.length ? 1 : 0,
        to: rows.length,
      });
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Could not load supplier",
        text: "Please try agiagn",
      });
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    loadSupplier();
  }, [loadSupplier]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const changeStatus = (value) => {
    setStatus(value);
    setPage(1);
  };

  const openAdd = () => {
    setEditing(null);
    setForm({
      ...emptyForm,
    });

    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      name: item.name ?? "",
      contact_name: item.contact_name ?? "",
      email: item.email ?? "",
      phone: item.phone ?? "",
      address: item.address ?? "",
      is_active: Boolean(item.is_active),
    });

    setModalOpen(true);
  };

  const updateField = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();

    setSaving(true);

    try {
      if (editing) {
        await updateSupplier(editing.id, form);
      } else {
        await createSupplier(form);
      }

      setModalOpen(false);

      await Swal.fire({
        icon: "success",
        title: editing ? "Supplier Updated!" : "Supplier Created!",
        text: editing
          ? "Supplier updated successfully."
          : "New supplier added successfully.",
        timer: 1800,
        showConfirmButton: false,
      });

      await loadSupplier();
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Not saved",
        text:
          error?.response?.data?.message ??
          error.message ??
          "Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    const result = await Swal.fire({
      title: "Are you sure to delete supplier ?",
      text: `Delete ${item.name} ? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      confirmButtonColor: "#dc2626",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      await deleteSupplier(item.id);

      await Swal.fire({
        icon: "success",
        title: "Supplier Deleted!",
        text: "Supplier has been deleted successfully.",
        timer: 2000,
        showConfirmButton: false,
      });

      await loadSupplier();
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Delete Failed!",
        text: error?.response?.data?.message ?? "Something went wrong.",
      });
    }
  };

  const activeOnPage = suppliers.filter((item) =>
    Boolean(item.is_active),
  ).length;
  const inactiveOnPage = suppliers.length - activeOnPage;

  const cards = [
    {
      label: "Total suppliers",
      value: pagination.total,
      icon: Users,
      iconClass: "bg-violet-50 text-violet-700",
      caption: "Across all pages",
    },
    {
      label: "Active on this page",
      value: activeOnPage,
      icon: UserCheck,
      iconClass: "bg-emerald-50 text-emerald-700",
      caption: "Currently displayed",
    },
    {
      label: "Inactive on this page",
      value: inactiveOnPage,
      icon: UserX,
      iconClass: "bg-amber-50 text-amber-700",
      caption: "Currently displayed",
    },
  ];

  const statusBadge = (active) => (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${active ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
  const actions = (item) => (
    <div className="flex items-center gap-1">
      <button
        type="button"
        aria-label={`Edit ${item.name}`}
        onClick={() => openEdit(item)}
        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
      >
        <Pencil size={16} />
      </button>
      <button
        type="button"
        aria-label={`Delete ${item.name}`}
        onClick={() => handleDelete(item)}
        className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );

  return (
    <div className="min-w-0 w-full bg-[#f8f9fb] p-4 text-slate-900 sm:p-6 xl:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[.18em] text-violet-600">
              Inventory / Partners
            </p>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Supplier Management
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Manage your fashion suppliers and their contact details.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={loadSupplier}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />{" "}
              Refresh
            </button>
            <button
              onClick={openAdd}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-700"
            >
              <Plus size={17} /> Add Supplier
            </button>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {cards.map(({ label, value, icon: Icon, iconClass, caption }) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <p className="text-sm text-slate-500">{label}</p>
                <span className={`rounded-xl p-2.5 ${iconClass}`}>
                  <Icon size={19} />
                </span>
              </div>
              <p className="mt-3 text-3xl font-semibold tracking-tight">
                {value}
              </p>
              <p className="mt-1 text-xs text-slate-400">{caption}</p>
            </div>
          ))}
        </section>
        <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold">All Suppliers</h2>
              <p className="text-xs text-slate-500">Your supplier directory</p>
            </div>
            <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
              <label className="relative flex-1 lg:w-72">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search suppliers..."
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />
              </label>
              <select
                value={status}
                onChange={(e) => changeStatus(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-500"
              >
                <option value="all">All statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          {loading ? (
            <div className="flex min-h-64 items-center justify-center gap-2 text-sm text-slate-500">
              <Loader2 className="animate-spin" size={19} /> Loading
              suppliers...
            </div>
          ) : suppliers.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-2 px-4 text-center">
              <Users size={30} className="text-slate-300" />
              <p className="font-medium">No suppliers found</p>
              <p className="text-sm text-slate-500">
                Try another search or add your first supplier.
              </p>
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[850px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      {[
                        "Supplier",
                        "Contact person",
                        "Email",
                        "Phone",
                        "Address",
                        "Status",
                        "Actions",
                      ].map((h) => (
                        <th key={h} className="px-5 py-4 font-semibold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {suppliers.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/70">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-sm font-bold text-violet-700">
                              {item.name?.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-900">
                                {item.name}
                              </p>
                              <p className="text-xs text-slate-400">
                                #{item.id}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-slate-600">
                          {item.contact_name || "—"}
                        </td>
                        <td className="px-5 py-4 text-slate-600">
                          {item.email || "—"}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-slate-600">
                          {item.phone || "—"}
                        </td>
                        <td
                          className="max-w-48 truncate px-5 py-4 text-slate-600"
                          title={item.address || ""}
                        >
                          {item.address || "—"}
                        </td>
                        <td className="px-5 py-4">
                          {statusBadge(Boolean(item.is_active))}
                        </td>
                        <td className="px-5 py-4">{actions(item)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="divide-y divide-slate-100 lg:hidden">
                {suppliers.map((item) => (
                  <article key={item.id} className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-sm font-bold text-violet-700">
                          {item.name?.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <h3 className="truncate font-semibold">
                            {item.name}
                          </h3>
                          <p className="text-xs text-slate-400">#{item.id}</p>
                        </div>
                      </div>
                      {statusBadge(Boolean(item.is_active))}
                    </div>
                    <div className="space-y-2 break-words text-sm text-slate-600">
                      <p>{item.contact_name || "No contact person"}</p>
                      <p className="flex items-start gap-2">
                        <Mail size={15} className="mt-0.5 shrink-0" />
                        {item.email || "—"}
                      </p>
                      <p className="flex items-start gap-2">
                        <Phone size={15} className="mt-0.5 shrink-0" />
                        {item.phone || "—"}
                      </p>
                      <p className="flex items-start gap-2">
                        <MapPin size={15} className="mt-0.5 shrink-0" />
                        {item.address || "—"}
                      </p>
                    </div>
                    <div className="flex justify-end border-t border-slate-100 pt-2">
                      {actions(item)}
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
          <footer className="flex flex-col gap-3 border-t border-slate-100 p-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Showing {pagination.from}–{pagination.to} of {pagination.total}{" "}
              suppliers
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={loading || page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg border border-slate-200 p-2 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Previous page"
              >
                <ChevronLeft size={17} />
              </button>
              <span className="px-2 text-xs">
                Page {pagination.currentPage} of {pagination.last_page}
              </span>
              <button
                disabled={loading || page >= pagination.last_page}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border border-slate-200 p-2 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Next page"
              >
                <ChevronRight size={17} />
              </button>
            </div>
          </footer>
        </section>
      </div>
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 sm:p-6"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !saving) setModalOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="supplier-modal-title"
            className="max-h-[90dvh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-7"
          >
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 id="supplier-modal-title" className="text-xl font-semibold">
                  {editing ? "Edit Supplier" : "Add Supplier"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Enter your supplier information below.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                disabled={saving}
                aria-label="Close"
                className="rounded-lg p-2 hover:bg-slate-100"
              >
                <X size={19} />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { name: "name", label: "Supplier name", required: true },
                  { name: "contact_name", label: "Contact person" },
                  { name: "email", label: "Email", type: "email" },
                  { name: "phone", label: "Phone", type: "tel" },
                ].map((field) => (
                  <label
                    key={field.name}
                    className="block text-sm font-medium text-slate-700"
                  >
                    {field.label}
                    {field.required && " *"}
                    <input
                      name={field.name}
                      type={field.type || "text"}
                      required={field.required}
                      value={form[field.name]}
                      onChange={updateField}
                      className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                    />
                  </label>
                ))}
              </div>
              <label className="block text-sm font-medium text-slate-700">
                Address
                <textarea
                  name="address"
                  value={form.address}
                  onChange={updateField}
                  rows={3}
                  className="mt-1.5 w-full resize-y rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />
              </label>
              <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
                <input
                  name="is_active"
                  type="checkbox"
                  checked={form.is_active}
                  onChange={updateField}
                  className="h-4 w-4 accent-violet-600"
                />{" "}
                Active supplier
              </label>
              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editing
                      ? "Save Changes"
                      : "Add Supplier"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Supplier;
