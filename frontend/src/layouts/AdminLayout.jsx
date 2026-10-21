import React, { useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { LayoutDashboard, Package, Truck, List, ShoppingBag, CreditCard, Users, Settings, UserRound, LogOut, X, Menu, Search, CalendarDays, ChevronDown, Bell, ExternalLink } from 'lucide-react';

const NAV = [
    { label: 'Dashboard', to: '/admin', icon: LayoutDashboard },
    { label: 'Products', to: '/admin/products', badge: '148', icon: Package },
    { label: 'Supplier', to: '/admin/suppliers', icon: Truck },
    { label: 'Categories', to: '/admin/categories', icon: List },
    { label: 'Orders', to: '/admin/orders', badge: '12', amber: true, icon: ShoppingBag },
    { label: 'Payments', to: '/admin/payments', icon: CreditCard },
    { label: 'Users', to: '/admin/users', icon: Users },
    { label: 'Settings', to: '/admin/settings', icon: Settings },
];

const UserIcon = () => <UserRound className="h-4 w-4" />;

export default function AdminLayout() {
    const [open, setOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-[#f7f7f5] text-neutral-900">

     
            <div
                onClick={() => setOpen(false)}
                className={`fixed inset-0 z-30 bg-black/40 transition-opacity lg:hidden ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
            />

        
            <aside
                className={`fixed inset-y-0 left-0 z-40 flex w-64 max-w-[85vw] flex-col justify-between border-r border-neutral-200 bg-white transition-transform duration-200 lg:static lg:max-w-none lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="flex min-h-0 flex-1 flex-col">
                    <div className="flex items-start justify-between px-5 py-5">
                        <div>
                            <h1 className="text-xl font-semibold tracking-wide text-black">VELORA</h1>
                            <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">Atelier Admin</p>
                        </div>
                        <button onClick={() => setOpen(false)} className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 lg:hidden" aria-label="Close menu">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <nav className="flex-1 space-y-0.5 overflow-y-auto">
                        {NAV.map((item) => (
                            <NavLink
                                key={item.label}
                                to={item.to}
                                end={item.to === '/admin'}
                                onClick={() => setOpen(false)}
                                className={({ isActive }) => `flex items-center gap-3 px-5 py-2.5 text-xs font-semibold uppercase tracking-wide ${isActive ? 'bg-black text-white' : 'text-neutral-700 hover:bg-neutral-100'}`}
                            >
                                <item.icon className="h-4 w-4" />
                                <span className="flex-1">{item.label}</span>
                                {item.badge && (
                                    <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${item.amber ? 'bg-amber-200 text-amber-900' : 'bg-neutral-200 text-neutral-700'}`}>
                                        {item.badge}
                                    </span>
                                )}
                            </NavLink>
                        ))}
                    </nav>
                </div>

       
                <div className="border-t border-neutral-200">
                    <div className="flex items-center gap-3 px-4 py-4">
                        <div className="relative shrink-0">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white"><UserIcon /></div>
                            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-semibold text-black">Sophea Chan</p>
                            <p className="truncate text-[10px] text-neutral-500">Head of Operations</p>
                        </div>
                        <button className="rounded-md p-1.5 text-neutral-600 hover:bg-neutral-100" aria-label="Log out">
                            <LogOut className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="flex items-center justify-between border-t border-neutral-100 px-4 py-2 text-[10px] uppercase tracking-wide text-neutral-500">
                        <span>Atelier Ops</span>
                        <span className="flex items-center gap-1.5 font-medium text-neutral-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Online
                        </span>
                    </div>
                </div>
            </aside>

       
            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">

        
                <header className="flex h-16 shrink-0 items-center gap-2 border-b border-neutral-200 bg-white px-3 sm:gap-3 sm:px-6">
                    <button onClick={() => setOpen(true)} className="rounded-md p-2 text-neutral-700 hover:bg-neutral-100 lg:hidden" aria-label="Open menu">
                        <Menu className="h-5 w-5" />
                    </button>

                    <label className="relative min-w-0 flex-1 md:max-w-sm lg:max-w-md">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                            <Search className="h-4 w-4" />
                        </span>
                        <input
                            type="text"
                            placeholder="Search orders, products, customers"
                            className="w-full rounded-md border border-neutral-200 bg-neutral-100 py-2 pl-9 pr-3 text-xs placeholder:text-neutral-500 focus:border-black focus:bg-white focus:outline-none sm:pr-12"
                        />
                        <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 rounded border border-neutral-300 bg-white px-1.5 py-0.5 text-[10px] text-neutral-500 sm:block">⌘K</kbd>
                    </label>

                    <div className="ml-auto flex items-center gap-2 sm:gap-3">
                        <div className="hidden items-center gap-2 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-[11px] xl:flex">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            <span className="font-semibold">Phnom Penh Hub:</span>
                            <span className="text-neutral-600">Online</span>
                        </div>

                        <button className="hidden items-center gap-2 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-[11px] font-medium uppercase tracking-wide hover:bg-neutral-100 md:flex">
                            <CalendarDays className="h-3.5 w-3.5" />
                            Today: Oct 24, 2026
                            <ChevronDown className="h-3.5 w-3.5 text-neutral-500" />
                        </button>

                        <button className="relative rounded-md p-2 text-neutral-700 hover:bg-neutral-100" aria-label="Notifications">
                            <Bell className="h-5 w-5" />
                            <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-bold text-white">3</span>
                        </button>

                        <Link to="/" className="hidden items-center gap-1.5 rounded-md border border-neutral-300 bg-white px-3 py-2 text-[11px] font-semibold uppercase tracking-wide hover:bg-neutral-100 sm:flex">
                            Storefront
                            <ExternalLink className="h-3.5 w-3.5" />
                        </Link>

                        <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-white" aria-label="Account">
                            <UserIcon />
                        </button>
                    </div>
                </header>

              
                <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
