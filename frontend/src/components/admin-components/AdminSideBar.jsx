import React, { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

import {
  LayoutDashboard,
  Package,
  Factory,
  Shapes,
  ShoppingBag,
  Banknote,
  Users,
  SlidersHorizontal,
  X,
} from "lucide-react";

// Sidebar Links
const sidebarLinks = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    path: "/admin/productfeature",
    icon: Package,
    badge: { value: 148, tone: "gray" },
  },
  {
    name: "Suppliers",
    path: "/admin/supplier",
    icon: Factory,
  },
  {
    name: "Categories",
    path: "/admin/category",
    icon: Shapes,
  },
  {
    name: "Orders",
    path: "/admin/order",
    icon: ShoppingBag,
    badge: { value: 12, tone: "yellow" },
  },
  {
    name: "Payments",
    path: "/admin/payment",
    icon: Banknote,
  },
  {
    name: "Users",
    path: "/admin/user",
    icon: Users,
  },
  {
    name: "Settings",
    path: "/admin/setting",
    icon: SlidersHorizontal,
  },
];

// Badge Styles
const badgeStyles = {
  gray: "bg-gray-100 text-gray-600",
  yellow: "bg-amber-200 text-amber-900",
};

const AdminSideBar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  // Close sidebar when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname, setIsOpen]);

  // Prevent background scrolling on mobile
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1023px)");

    const updateScrollLock = () => {
      document.body.style.overflow =
        isOpen && mediaQuery.matches ? "hidden" : "";
    };

    updateScrollLock();

    mediaQuery.addEventListener("change", updateScrollLock);

    return () => {
      document.body.style.overflow = "";
      mediaQuery.removeEventListener("change", updateScrollLock);
    };
  }, [isOpen]);

  // Close sidebar with Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, setIsOpen]);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        id="admin-sidebar"
        aria-label="Admin navigation"
        className={`
          fixed inset-y-0 left-0 z-50
          flex h-dvh w-64 flex-col
          border-r border-gray-200 bg-white
          transition-transform duration-300 ease-in-out

          lg:sticky lg:top-0 lg:z-30 lg:h-screen
          lg:shrink-0 lg:translate-x-0

          ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-5">
          <div>
            <h1 className="font-serif text-2xl leading-none tracking-wide text-black">
              VELORA
            </h1>

            <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-gray-500">
              Atelier Admin
            </p>
          </div>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-md p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
          {sidebarLinks.map(
            ({ name, path, icon: Icon, badge }) => (
              <NavLink
                key={name}
                to={path}
                className={({ isActive }) =>
                  [
                    "group flex items-center justify-between rounded-md px-4 py-3 text-sm uppercase transition-colors",

                    isActive
                      ? "bg-black text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-black",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="flex min-w-0 items-center gap-4">
                      <Icon
                        size={18}
                        strokeWidth={1.5}
                        className={`shrink-0 ${
                          isActive
                            ? "text-white"
                            : "text-gray-700 group-hover:text-black"
                        }`}
                      />

                      <span
                        className={`
                          truncate tracking-[0.12em]
                          ${
                            isActive
                              ? "font-semibold"
                              : "font-medium"
                          }
                        `}
                      >
                        {name}
                      </span>
                    </span>

                    {badge && (
                      <span
                        className={`
                          ml-2 shrink-0 rounded px-2 py-0.5
                          text-xs font-medium normal-case
                          tracking-normal
                          ${badgeStyles[badge.tone] ?? ""}
                        `}
                      >
                        {badge.value}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            )
          )}
        </nav>
      </aside>
    </>
  );
};

export default AdminSideBar;