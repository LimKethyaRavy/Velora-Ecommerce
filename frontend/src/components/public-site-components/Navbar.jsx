import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Heart,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  Package,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";// adjust path if needed

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { user, isAuthenticate, logoutPublic } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop", dropdown: true },
    { name: "Categories", path: "/categories", dropdown: true },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    setProfileOpen(false);
    setMenuOpen(false);
    await logoutPublic();
    navigate("/login");
  };

  const getInitials = (name = "") => {
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "")
      .join("");
  };

  return (
    <header className="w-full bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="h-[70px] flex items-center justify-between gap-5">
          {/* Logo */}
          <Link
            to="/"
            className="shrink-0 text-2xl sm:text-3xl font-serif tracking-[0.18em] text-[#1c1c1c]"
          >
            VELORA
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-9">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="flex items-center gap-1 text-[13px] text-gray-800 hover:text-[#a58b73] transition-colors group"
              >
                {link.name}

                {link.dropdown && (
                  <ChevronDown
                    size={13}
                    className="group-hover:rotate-180 transition-transform"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Search */}
            <div className="hidden md:flex items-center bg-[#f5f3f1] rounded-full px-4 py-2 w-[190px] xl:w-[220px]">
              <Search size={16} className="text-gray-500 shrink-0" />

              <input
                type="text"
                placeholder="Search products..."
                className="w-full bg-transparent outline-none border-none pl-2 text-xs text-gray-700 placeholder:text-gray-400"
              />
            </div>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="relative text-gray-800 hover:text-[#a58b73] transition-colors"
            >
              <Heart size={21} strokeWidth={1.5} />
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              aria-label="Shopping cart"
              className="relative text-gray-800 hover:text-[#a58b73] transition-colors"
            >
              <ShoppingCart size={21} strokeWidth={1.5} />

              <span className="absolute -top-2 -right-2 w-[17px] h-[17px] rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
                2
              </span>
            </Link>

            {/* Desktop Account / Profile */}
            {isAuthenticate && user ? (
              <div className="relative hidden lg:block" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-[#f5f3f1] transition-colors"
                  aria-label="Account menu"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover border border-gray-200"
                    />
                  ) : (
                    <span className="w-8 h-8 rounded-full bg-[#3b5570] text-white text-xs font-medium flex items-center justify-center">
                      {getInitials(user.name) || <User size={15} />}
                    </span>
                  )}

                  <span className="text-[13px] font-medium text-gray-800 max-w-[110px] truncate">
                    {user.name}
                  </span>

                  <ChevronDown
                    size={13}
                    className={`text-gray-500 transition-transform ${
                      profileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {profileOpen && (
                  <div className="absolute right-0 mt-2.5 w-56 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50">
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <p className="text-xs font-semibold text-[#1c1c1c] truncate">
                        {user.name}
                      </p>
                      <p className="text-[11px] text-gray-500 truncate mt-0.5">
                        {user.email}
                      </p>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-[#f5f3f1] hover:text-[#a58b73] transition-colors"
                      >
                        <User size={14} />
                        <span>My Profile</span>
                      </Link>

                      <Link
                        to="/orders"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-[#f5f3f1] hover:text-[#a58b73] transition-colors"
                      >
                        <Package size={14} />
                        <span>My Orders</span>
                      </Link>
                    </div>

                    <div className="border-t border-gray-100 pt-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={14} />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden lg:inline-flex items-center gap-1.5 text-[13px] text-gray-800 hover:text-[#a58b73] transition-colors"
              >
                <User size={20} strokeWidth={1.5} />
                <span>Sign in</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden text-gray-800 hover:text-[#a58b73] transition-colors"
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-5">
            {/* Mobile Search */}
            <div className="flex items-center bg-[#f5f3f1] rounded-full px-4 py-3 mb-5 md:hidden">
              <Search size={17} className="text-gray-500" />

              <input
                type="text"
                placeholder="Search products..."
                className="w-full bg-transparent outline-none pl-2 text-sm"
              />
            </div>

            {/* Mobile Navigation Links */}
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={closeMenu}
                  className="flex items-center justify-between px-3 py-3 text-sm text-gray-800 hover:bg-[#f5f3f1] hover:text-[#a58b73] rounded-md transition-colors"
                >
                  {link.name}

                  {link.dropdown && <ChevronDown size={15} />}
                </Link>
              ))}
            </nav>

            {/* Mobile Account Section */}
            <div className="border-t border-gray-100 mt-4 pt-4 px-3">
              {isAuthenticate && user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                      />
                    ) : (
                      <span className="w-10 h-10 rounded-full bg-[#3b5570] text-white text-sm font-medium flex items-center justify-center">
                        {getInitials(user.name) || <User size={18} />}
                      </span>
                    )}

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 pt-1">
                    <Link
                      to="/profile"
                      onClick={closeMenu}
                      className="flex items-center gap-2 py-2 text-sm text-gray-700 hover:text-[#a58b73]"
                    >
                      <User size={15} />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      to="/orders"
                      onClick={closeMenu}
                      className="flex items-center gap-2 py-2 text-sm text-gray-700 hover:text-[#a58b73]"
                    >
                      <Package size={15} />
                      <span>My Orders</span>
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex items-center gap-2 py-2 text-sm text-red-600 hover:text-red-700 text-left"
                    >
                      <LogOut size={15} />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-5">
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="text-sm font-medium text-gray-800 hover:text-[#a58b73]"
                  >
                    Sign in
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="text-sm text-gray-600 hover:text-[#a58b73]"
                  >
                    Create account
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;