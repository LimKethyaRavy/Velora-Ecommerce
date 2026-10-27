import { Bell, Calendar, ChevronDown, ExternalLink, Menu, Search, User } from 'lucide-react';
import React, { useState } from 'react';

const AdminNavbar = ({ isOpen, setIsOpen }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    date: 'numeric',
    year: 'numeric',
  })
    .format(new Date())
    .toLocaleUpperCase();

  return (
    <header className="w-full border-b border-gray-200 bg-white px-4 py-3 font-sans lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="hidden min-w-0 flex-1 items-center rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-gray-200 lg:flex">
          <Search className="mr-2 h-4 w-4 shrink-0 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders, products, customers"
            className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
          />
        </div>

        <div className="hidden items-center gap-2 whitespace-nowrap rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-700 lg:flex">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Phnom Penh: Online
        </div>

        <div className="ml-auto hidden items-center gap-4 lg:flex">
          <button className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span>TODAY: {currentDate}</span>
            <ChevronDown className="ml-1 h-3.5 w-3.5 text-gray-400" />
          </button>

          <button className="relative rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-50 hover:text-black">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
              3
            </span>
          </button>

          <div className="h-5 w-px bg-gray-200" />

          <button className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-xs font-bold uppercase tracking-wider text-gray-800 transition-colors hover:bg-gray-50">
            Storefront
            <ExternalLink className="h-3.5 w-3.5 text-gray-500" />
          </button>

          <button className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white transition-opacity hover:opacity-90">
            <User className="h-5 w-5" />
          </button>
        </div>

        <div className="flex w-full min-w-0 items-center gap-2 lg:hidden">
          <div className="flex min-w-0 flex-1 items-center rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5">
            <Search className="mr-2 h-4 w-4 shrink-0 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
            />
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="shrink-0 rounded-lg border border-gray-200 p-2 text-gray-700 hover:text-black focus:outline-none"
            aria-label={isOpen ? 'Close admin sidebar' : 'Open admin sidebar'}
            aria-expanded={isOpen}
            aria-controls="admin-sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="shrink-0 rounded-lg border border-gray-200 p-2 text-gray-700 hover:text-black focus:outline-none"
            aria-label={mobileMenuOpen ? 'Close mobile options' : 'Open mobile options'}
            aria-expanded={mobileMenuOpen}
            aria-controls="admin-mobile-options"
          >
            <ChevronDown
              className={`h-5 w-5 transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          id="admin-mobile-options"
          className="mt-3 flex flex-col gap-3 border-t border-gray-100 pt-3 lg:hidden"
        >
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Phnom Penh Hub: Online
          </div>

          <button className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700">
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              TODAY: {currentDate}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
          </button>

          <div className="flex items-center justify-between pt-2">
            <button className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <span className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white">
                  3
                </span>
              </span>
              Notifications
            </button>

            <button className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-gray-800">
              Storefront
              <ExternalLink className="h-3.5 w-3.5 text-gray-500" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default AdminNavbar;
