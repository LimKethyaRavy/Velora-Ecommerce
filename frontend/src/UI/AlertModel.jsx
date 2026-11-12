import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/* -------------------------------------------------------------------------- */
/*  Velora alert modals: success, error and confirm (delete)                  */
/*  No dependencies besides React + Tailwind.                                 */
/*                                                                            */
/*  1. Wrap your app:   <AlertProvider><App /></AlertProvider>                */
/*  2. Use anywhere:    const alert = useAlert();                             */
/*                                                                            */
/*     alert.success({ title: "Product saved", message: "..." });             */
/*     alert.error({ title: "Couldn’t save", message: "..." });               */
/*     const ok = await alert.confirm({ title: "Discard changes?" });         */
/*     alert.confirmDelete({                                                  */
/*       itemName: "Classic Oversized T-Shirt",                               */
/*       onConfirm: () => api.delete(`/products/${id}`),                      */
/*     });                                                                    */
/* -------------------------------------------------------------------------- */

const AlertContext = createContext(null);

export function useAlert() {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error("useAlert must be used inside <AlertProvider>");
  return ctx;
}

/* ------------------------------- Icons ------------------------------------ */

const Icon = ({ children, className = "h-6 w-6" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {children}
  </svg>
);

const CheckIcon = () => (
  <Icon>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Icon>
);
const CrossIcon = () => (
  <Icon>
    <path d="M6 6l12 12M18 6L6 18" />
  </Icon>
);
const TrashIcon = () => (
  <Icon>
    <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12M9 7V4h6v3" />
  </Icon>
);
const WarnIcon = () => (
  <Icon>
    <path d="M12 3l10 18H2L12 3zM12 10v5M12 18h.01" />
  </Icon>
);

const Spinner = () => (
  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity=".3" strokeWidth="3" />
    <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

/* ------------------------------- Tones ------------------------------------ */

const TONES = {
  success: {
    badge: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    primary: "bg-violet-600 hover:bg-violet-700 focus-visible:ring-violet-300",
    bar: "bg-emerald-500",
    icon: <CheckIcon />,
  },
  error: {
    badge: "bg-rose-50 text-rose-600 ring-rose-100",
    primary: "bg-violet-600 hover:bg-violet-700 focus-visible:ring-violet-300",
    bar: "bg-rose-500",
    icon: <CrossIcon />,
  },
  danger: {
    badge: "bg-rose-50 text-rose-600 ring-rose-100",
    primary: "bg-rose-600 hover:bg-rose-700 focus-visible:ring-rose-300",
    icon: <TrashIcon />,
  },
  warning: {
    badge: "bg-amber-50 text-amber-600 ring-amber-100",
    primary: "bg-neutral-900 hover:bg-black focus-visible:ring-neutral-300",
    icon: <WarnIcon />,
  },
};

const toneKey = (m) => (m.type === "confirm" ? m.tone || "danger" : m.type);

/* ---------------------------- Auto-close bar ------------------------------ */

function CountdownBar({ duration, className }) {
  const [run, setRun] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setRun(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <div className="absolute inset-x-0 top-0 h-1 overflow-hidden rounded-t-2xl bg-neutral-100">
      <div
        className={`h-full ease-linear transition-[width] ${className}`}
        style={{ width: run ? "0%" : "100%", transitionDuration: `${duration}ms` }}
      />
    </div>
  );
}

/* -------------------------------- Modal ----------------------------------- */

function AlertModal({ modal, open, busy, onCancel, onConfirm }) {
  const primaryRef = useRef(null);
  const tone = TONES[toneKey(modal)];
  const isConfirm = modal.type === "confirm";
  const duration = modal.duration ?? 2500;
  const autoClose = modal.type === "success" && modal.autoClose !== false;

  useEffect(() => {
    if (open) primaryRef.current?.focus();
  }, [open, modal]);

  const primaryLabel = isConfirm
    ? modal.confirmText || "Confirm"
    : modal.type === "error" && modal.onRetry
    ? modal.retryText || "Try again"
    : modal.buttonText || (modal.type === "success" ? "Done" : "Close");

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-200 ${
        open ? "opacity-100" : "opacity-0"
      }`}
      role="presentation"
    >
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-neutral-900/40 backdrop-blur-[2px]"
        onClick={() => !busy && onCancel()}
      />

      {/* panel */}
      <div
        role={modal.type === "error" ? "alertdialog" : "dialog"}
        aria-modal="true"
        aria-labelledby="velora-alert-title"
        aria-describedby="velora-alert-message"
        className={`relative w-full max-w-md rounded-2xl border border-neutral-200 bg-white shadow-[0_24px_60px_-12px_rgba(17,24,39,0.28)] transition duration-200 ${
          open ? "translate-y-0 scale-100" : "translate-y-2 scale-95"
        }`}
      >
        {autoClose && (
          <CountdownBar key={modal.title} duration={duration} className={tone.bar} />
        )}

        <div className="flex gap-4 p-6">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-4 ${tone.badge}`}
          >
            {tone.icon}
          </div>

          <div className="min-w-0 flex-1">
            <h2
              id="velora-alert-title"
              className="text-base font-semibold tracking-tight text-neutral-900"
            >
              {modal.title}
            </h2>
            {modal.message && (
              <p id="velora-alert-message" className="mt-1.5 text-sm leading-relaxed text-neutral-500">
                {modal.message}
              </p>
            )}
            {modal.detail && (
              <div className="mt-3 truncate rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm font-medium text-neutral-800">
                {modal.detail}
              </div>
            )}
          </div>
        </div>

        {/* footer */}
        <div className="flex justify-end gap-2 rounded-b-2xl border-t border-neutral-100 bg-neutral-50/70 px-6 py-4">
          {(isConfirm || (modal.type === "error" && modal.onRetry)) && (
            <button
              type="button"
              onClick={onCancel}
              disabled={busy}
              className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-neutral-200 disabled:opacity-50"
            >
              {modal.cancelText || "Cancel"}
            </button>
          )}
          <button
            ref={primaryRef}
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={`inline-flex min-w-[96px] items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition focus:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-70 ${tone.primary}`}
          >
            {busy && <Spinner />}
            {busy ? modal.busyText || "Working…" : primaryLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- Provider --------------------------------- */

export function AlertProvider({ children }) {
  const [modal, setModal] = useState(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const resolverRef = useRef(null);

  const show = useCallback((config) => {
    return new Promise((resolve) => {
      resolverRef.current?.(false);
      resolverRef.current = resolve;
      setBusy(false);
      setModal(config);
      requestAnimationFrame(() => setOpen(true));
    });
  }, []);

  const close = useCallback((result = false) => {
    setOpen(false);
    const resolve = resolverRef.current;
    resolverRef.current = null;
    setTimeout(() => {
      setModal(null);
      setBusy(false);
      resolve?.(result);
    }, 200);
  }, []);

  // primary button
  const handleConfirm = useCallback(async () => {
    if (!modal) return;

    if (modal.type === "error" && modal.onRetry) {
      close(false);
      setTimeout(modal.onRetry, 220);
      return;
    }

    if (modal.type === "confirm" && modal.onConfirm) {
      setBusy(true);
      try {
        await modal.onConfirm();
        resolverRef.current?.(true);
        resolverRef.current = null;
        setBusy(false);
        // swap the same dialog into a success state
        setModal({
          type: "success",
          title: modal.successTitle || "Done",
          message: modal.successMessage,
        });
        resolverRef.current = null;
      } catch (err) {
        setBusy(false);
        setModal({
          type: "error",
          title: modal.errorTitle || "Something went wrong",
          message:
            err?.response?.data?.message ||
            err?.message ||
            "The action couldn’t be completed. Try again.",
          onRetry: () => show(modal),
        });
      }
      return;
    }

    close(true);
  }, [modal, close, show]);

  const handleCancel = useCallback(() => close(false), [close]);

  // auto-close success
  useEffect(() => {
    if (open && modal?.type === "success" && modal.autoClose !== false) {
      const t = setTimeout(() => close(true), modal.duration ?? 2500);
      return () => clearTimeout(t);
    }
  }, [open, modal, close]);

  // Esc + scroll lock
  useEffect(() => {
    if (!modal) return;
    const onKey = (e) => e.key === "Escape" && !busy && handleCancel();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [modal, busy, handleCancel]);

  const api = useMemo(
    () => ({
      success: (cfg) => show({ type: "success", ...cfg }),
      error: (cfg) => show({ type: "error", ...cfg }),
      warning: (cfg) => show({ type: "warning", ...cfg }),
      confirm: (cfg) => show({ type: "confirm", tone: "danger", ...cfg }),
      confirmDelete: ({ itemName, ...cfg }) =>
        show({
          type: "confirm",
          tone: "danger",
          title: "Delete this product?",
          message: "This removes it and all of its variants. You can’t undo this.",
          detail: itemName,
          confirmText: "Delete",
          busyText: "Deleting…",
          successTitle: "Product deleted",
          successMessage: itemName ? `${itemName} was removed from your catalog.` : undefined,
          errorTitle: "Couldn’t delete product",
          ...cfg,
        }),
      close,
    }),
    [show, close]
  );

  return (
    <AlertContext.Provider value={api}>
      {children}
      {modal && (
        <AlertModal
          modal={modal}
          open={open}
          busy={busy}
          onCancel={handleCancel}
          onConfirm={handleConfirm}
        />
      )}
    </AlertContext.Provider>
  );
}

/* --------------------------- Example usage -------------------------------- */
/*
// main.jsx
<AlertProvider>
  <App />
</AlertProvider>

// ProductsPage.jsx
const alert = useAlert();

// Delete button in the table row
const handleDelete = (product) =>
  alert.confirmDelete({
    itemName: product.name,
    onConfirm: async () => {
      await axios.delete(`/api/products/${product.id}`);
      refetchProducts();
    },
  });

// Save form
try {
  await axios.post("/api/products", form);
  alert.success({ title: "Product added", message: "It’s now live in your catalog." });
} catch (e) {
  alert.error({
    title: "Couldn’t add product",
    message: e.response?.data?.message || "Check the form and try again.",
  });
}
*/