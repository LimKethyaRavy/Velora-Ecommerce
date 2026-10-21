import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Folder,
  FolderTree,
  Layers,
  FolderPlus,
  Tag,
  Link2,
  Users,
} from "lucide-react";

/* ---------- constants ---------- */
const PAGE_SIZE = 10;
const GENDERS = ["Men", "Women", "Unisex"];

const EMPTY_FORM = {
  name: "",
  slug: "",
  parent_id: "",
  gender: "Unisex",
};

const GENDER_STYLES = {
  Men: "bg-blue-50 text-blue-700",
  Women: "bg-pink-50 text-pink-700",
  Unisex: "bg-neutral-100 text-neutral-700",
};

const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const inputCls =
  "w-full rounded-lg border border-neutral-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none placeholder:text-neutral-400 focus:border-neutral-900";

/* ---------- small pieces ---------- */
function StatCard({ icon: Icon, iconClass, label, value, caption }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-6">
      <div className="flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-wider text-neutral-700 sm:text-[12px]">
        <Icon size={16} strokeWidth={1.6} className={iconClass} />
        {label}
      </div>
      <p className="mt-3 font-serif text-[32px] font-semibold leading-none sm:mt-4 sm:text-[40px]">
        {value}
      </p>
      <p className="mt-3 text-[13px] text-neutral-500 sm:mt-4">{caption}</p>
    </div>
  );
}

function GenderBadge({ gender }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
        GENDER_STYLES[gender] || GENDER_STYLES.Unisex
      }`}
    >
      {gender || "Unisex"}
    </span>
  );
}

function Field({ label, required, icon: Icon, hint, children }) {
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
      {hint && <p className="mt-1.5 text-xs text-neutral-500">{hint}</p>}
    </div>
  );
}

/* ---------- drawer ---------- */
function CategoryDrawer({
  open,
  form,
  setForm,
  parentOptions,
  editing,
  onClose,
  onSave,
  onNameChange,
  onSlugChange,
}) {
  return (
    <>
      {/* backdrop: shown on every screen smaller than xl */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-black/30 transition-opacity xl:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* top-16 = height of your navbar; change it if your navbar is a different height */}
      <aside
        className={[
          "fixed right-0 top-16 z-40 flex h-[calc(100%-4rem)] w-full flex-col border-l border-neutral-200 bg-white shadow-xl transition-transform duration-300 sm:max-w-[400px]",
          open ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
        aria-hidden={!open}
      >
        <div className="flex items-start justify-between px-5 pt-6 sm:px-6 sm:pt-8">
          <div>
            <h2 className="font-serif text-[24px] font-medium leading-tight sm:text-[26px]">
              {editing ? "Edit Category" : "Add New Category"}
            </h2>
            <p className="mt-1 text-sm text-neutral-600">
              Fill in the category details below
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
          <div className="flex-1 space-y-5 px-5 py-6 sm:px-6 sm:py-8">
            <Field label="Category name" required icon={Tag}>
              <input
                required
                value={form.name}
                onChange={(e) => onNameChange(e.target.value)}
                placeholder="e.g. Summer Dresses"
                className={inputCls}
              />
            </Field>

            <Field
              label="Slug"
              required
              icon={Link2}
              hint="Used in the URL. Generated from the name, you can edit it."
            >
              <input
                required
                value={form.slug}
                onChange={(e) => onSlugChange(e.target.value)}
                placeholder="summer-dresses"
                className={`${inputCls} font-mono text-[13px]`}
              />
            </Field>

            <Field
              label="Parent category"
              icon={FolderTree}
              hint="Leave empty to create a root category."
            >
              <select
                value={form.parent_id}
                onChange={(e) => setForm({ ...form, parent_id: e.target.value })}
                className={`${inputCls} appearance-none pr-9`}
              >
                <option value="">None (root category)</option>
                {parentOptions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3.5 top-[15px] text-neutral-500"
              />
            </Field>

            <Field label="Gender" required icon={Users}>
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className={`${inputCls} appearance-none pr-9`}
              >
                {GENDERS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3.5 top-[15px] text-neutral-500"
              />
            </Field>
          </div>

          <div className="space-y-3 border-t border-neutral-200 px-5 py-5 sm:px-6 sm:py-6">
            <button
              type="submit"
              className="w-full rounded-lg bg-neutral-950 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
            >
              Save Category
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

/* ---------- page content ---------- */
export default function Category() {
  // Data lives in state only. Load it from your API with useEffect + setCategories.
  // Each item: { id, name, slug, parent_id, gender }
  const [categories, setCategories] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState("All");
  const [page, setPage] = useState(1);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [slugTouched, setSlugTouched] = useState(false);

  const parentCount = categories.filter((c) => !c.parent_id).length;
  const subCount = categories.length - parentCount;

  const nameById = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c.name])),
    [categories]
  );

  // Only root categories can be parents; a category can't be its own parent.
  const parentOptions = categories.filter(
    (c) => !c.parent_id && c.id !== editingId
  );

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return categories.filter((c) => {
      const matchesText =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q);
      const matchesGender = genderFilter === "All" || c.gender === genderFilter;
      return matchesText && matchesGender;
    });
  }, [categories, searchTerm, genderFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const start = (safePage - 1) * PAGE_SIZE;
  const rows = filtered.slice(start, start + PAGE_SIZE);

  /* handlers */
  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setSlugTouched(false);
    setDrawerOpen(true);
  };

  const openEdit = (cat) => {
    setEditingId(cat.id);
    setForm({ ...EMPTY_FORM, ...cat, parent_id: cat.parent_id || "" });
    setSlugTouched(true);
    setDrawerOpen(true);
  };

  const closeDrawer = () => setDrawerOpen(false);

  const handleNameChange = (name) =>
    setForm((f) => ({
      ...f,
      name,
      slug: slugTouched ? f.slug : slugify(name),
    }));

  const handleSlugChange = (slug) => {
    setSlugTouched(true);
    setForm((f) => ({ ...f, slug: slugify(slug) }));
  };

  const handleSave = () => {
    const payload = { ...form, parent_id: form.parent_id || null };
    if (editingId) {
      setCategories((prev) =>
        prev.map((c) => (c.id === editingId ? { ...c, ...payload } : c))
      );
    } else {
      setCategories((prev) => [...prev, { ...payload, id: crypto.randomUUID() }]);
    }
    closeDrawer();
  };

  // Deleting a parent turns its subcategories into root categories.
  const handleDelete = (id) =>
    setCategories((prev) =>
      prev
        .filter((c) => c.id !== id)
        .map((c) => (c.parent_id === id ? { ...c, parent_id: null } : c))
    );

  const resetFilters = () => {
    setSearchTerm("");
    setGenderFilter("All");
    setPage(1);
  };

  const emptyTitle =
    categories.length === 0 ? "No categories yet" : "No categories match your search";
  const emptyText =
    categories.length === 0
      ? "Add your first category to start organizing products."
      : "Try a different keyword or reset the filters.";

  const EmptyState = (
    <div className="mx-auto flex max-w-xs flex-col items-center px-4 py-16 text-center sm:py-20">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
        <Folder size={22} strokeWidth={1.5} />
      </div>
      <p className="mt-4 text-sm font-semibold">{emptyTitle}</p>
      <p className="mt-1 text-sm text-neutral-500">{emptyText}</p>
      {categories.length === 0 && (
        <button
          onClick={openAdd}
          className="mt-5 flex items-center gap-2 rounded-full bg-neutral-950 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-neutral-800"
        >
          <Plus size={14} />
          Add Category
        </button>
      )}
    </div>
  );

  return (
    <>
      <div
        className={`px-4 py-5 transition-[margin] duration-300 sm:px-6 sm:py-6 lg:px-8 ${
          drawerOpen ? "xl:mr-[400px]" : ""
        }`}
      >
        {/* heading */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-neutral-700">
              <span className="h-2 w-2 rounded-full bg-emerald-600" />
              Categories
            </p>
            <h1 className="mt-1 font-serif text-[34px] font-medium leading-tight sm:text-[40px] lg:text-[46px]">
              Categories
            </h1>
            <p className="mt-1 text-sm text-neutral-700 sm:text-[15px]">
              Manage your product categories, subcategories, and gender sections.
            </p>
          </div>
          <button
            onClick={openAdd}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-neutral-950 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-neutral-800 sm:mt-6 sm:w-auto"
          >
            <Plus size={16} />
            Add Category
          </button>
        </div>

        {/* stats */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-8 sm:grid-cols-3 sm:gap-4">
          <StatCard
            icon={Folder}
            label="Total Categories"
            value={categories.length}
            caption="All categories in your system"
          />
          <StatCard
            icon={FolderTree}
            iconClass="text-emerald-600"
            label="Parent Categories"
            value={parentCount}
            caption="Main root categories"
          />
          <StatCard
            icon={Layers}
            iconClass="text-blue-600"
            label="Subcategories"
            value={subCount}
            caption="Nested under parent items"
          />
        </div>

        {/* filters */}
        <div className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"
            />
            <input
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              placeholder="Search category name or slug..."
              className="h-11 w-full rounded-lg border border-neutral-200 bg-white pl-11 pr-3 text-sm outline-none placeholder:text-neutral-500 focus:border-neutral-400"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-[173px] sm:flex-none">
              <select
                value={genderFilter}
                onChange={(e) => {
                  setGenderFilter(e.target.value);
                  setPage(1);
                }}
                className="h-11 w-full appearance-none rounded-lg border border-neutral-200 bg-white px-4 pr-9 text-sm outline-none focus:border-neutral-400"
              >
                <option value="All">All Genders</option>
                {GENDERS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
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
        </div>

        {/* list */}
        <div className="mt-5 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          {rows.length === 0 ? (
            EmptyState
          ) : (
            <>
              {/* table: md and up */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left text-[13px]">
                  <thead>
                    <tr className="text-[11px] uppercase tracking-wider text-neutral-600">
                      <th className="px-6 py-5 font-medium">#</th>
                      <th className="py-5 pr-4 font-medium">Name</th>
                      <th className="py-5 pr-4 font-medium">Slug</th>
                      <th className="py-5 pr-4 font-medium">Parent Category</th>
                      <th className="py-5 pr-4 font-medium">Gender</th>
                      <th className="py-5 pr-6 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((cat, i) => (
                      <tr
                        key={cat.id}
                        className="border-t border-neutral-100 hover:bg-neutral-50/70"
                      >
                        <td className="px-6 py-4 text-neutral-500">{start + i + 1}</td>
                        <td className="py-4 pr-4 font-medium">{cat.name}</td>
                        <td className="py-4 pr-4 font-mono text-xs text-neutral-500">
                          {cat.slug}
                        </td>
                        <td className="py-4 pr-4 text-neutral-700">
                          {cat.parent_id ? nameById[cat.parent_id] || "—" : "Root"}
                        </td>
                        <td className="py-4 pr-4">
                          <GenderBadge gender={cat.gender} />
                        </td>
                        <td className="py-4 pr-6">
                          <div className="flex items-center justify-end gap-4 text-neutral-600">
                            <button
                              aria-label="Edit category"
                              onClick={() => openEdit(cat)}
                              className="hover:text-neutral-950"
                            >
                              <Pencil size={16} strokeWidth={1.6} />
                            </button>
                            <button
                              aria-label="Delete category"
                              onClick={() => handleDelete(cat.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={16} strokeWidth={1.6} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* cards: below md */}
              <ul className="divide-y divide-neutral-100 md:hidden">
                {rows.map((cat) => (
                  <li key={cat.id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{cat.name}</p>
                        <p className="mt-0.5 truncate font-mono text-xs text-neutral-500">
                          {cat.slug}
                        </p>
                      </div>
                      <GenderBadge gender={cat.gender} />
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <p className="flex items-center gap-1.5 text-xs text-neutral-600">
                        <FolderTree size={14} strokeWidth={1.6} />
                        {cat.parent_id ? nameById[cat.parent_id] || "—" : "Root"}
                      </p>
                      <div className="flex items-center gap-4">
                        <button
                          aria-label="Edit category"
                          onClick={() => openEdit(cat)}
                          className="text-neutral-600 hover:text-neutral-950"
                        >
                          <Pencil size={16} strokeWidth={1.6} />
                        </button>
                        <button
                          aria-label="Delete category"
                          onClick={() => handleDelete(cat.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} strokeWidth={1.6} />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* footer / pagination */}
          <div className="flex flex-col items-center justify-between gap-3 border-t border-neutral-100 px-4 py-4 sm:flex-row sm:px-6 sm:py-5">
            <p className="text-xs text-neutral-600">
              Showing {filtered.length === 0 ? 0 : start + 1}–
              {Math.min(start + PAGE_SIZE, filtered.length)} of {filtered.length}{" "}
              categories
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
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

      <CategoryDrawer
        open={drawerOpen}
        form={form}
        setForm={setForm}
        parentOptions={parentOptions}
        editing={Boolean(editingId)}
        onClose={closeDrawer}
        onSave={handleSave}
        onNameChange={handleNameChange}
        onSlugChange={handleSlugChange}
      />
    </>
  );
}