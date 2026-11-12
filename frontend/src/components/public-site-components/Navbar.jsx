import React from "react";
import {
  Search,
  Heart,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop", dropdown: true },
    { name: "Categories", path: "/categories", dropdown: true },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const closeMenu = () => {
    setMenuOpen(false);
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

            {/* Mobile Account Links */}
            <div className="flex items-center gap-5 border-t border-gray-100 mt-4 pt-4 px-3">
              <Link
                to="/login"
                onClick={closeMenu}
                className="text-sm text-gray-700 hover:text-[#a58b73]"
              >
                Login
              </Link>

              <Link
                to="/register"
                onClick={closeMenu}
                className="text-sm text-gray-700 hover:text-[#a58b73]"
              >
                Register
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
