import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';

const Icon = ({ children, className = 'w-4 h-4' }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
        {children}
    </svg>
);

const NAV = [
    { label: 'Dashboard', active: true, icon: <><rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" /><rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" /></> },
    { label: 'Products', badge: '148', icon: <><path d="M3 4h18l-2 6H5z" /><path d="M5 10v10h14V10" /></> },
    { label: 'Suppliers', icon: <><path d="M3 7h11v9H3z" /><path d="M14 10h4l3 3v3h-7" /><circle cx="7" cy="18" r="1.6" /><circle cx="17" cy="18" r="1.6" /></> },
    { label: 'Categories', icon: <path d="M4 6h16M4 12h16M4 18h16" /> },
    { label: 'Orders', badge: '12', amber: true, icon: <><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></> },
    { label: 'Payments', icon: <><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></> },
    { label: 'Users', icon: <><circle cx="9" cy="8" r="3.2" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" /><path d="M16 4.5a3 3 0 0 1 0 5.6M18 14.4c1.8.8 3 2.6 3 4.6" /></> },
    { label: 'Settings', icon: <><path d="M4 6h10M18 6h2M4 12h2M10 12h10M4 18h12" /><circle cx="16" cy="6" r="2" /><circle cx="8" cy="12" r="2" /><circle cx="18" cy="18" r="2" /></> },
];

const UserIcon = () => (
    <Icon className="h-4 w-4"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" /></Icon>
);

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
                            <Icon className="h-5 w-5"><path d="M6 6l12 12M18 6 6 18" /></Icon>
                        </button>
                    </div>

                    <nav className="flex-1 space-y-0.5 overflow-y-auto">
                        {NAV.map((item) => (
                            <a
                                key={item.label}
                                href="#"
                                className={`flex items-center gap-3 px-5 py-2.5 text-xs font-semibold uppercase tracking-wide ${item.active ? 'bg-black text-white' : 'text-neutral-700 hover:bg-neutral-100'}`}
                            >
                                <Icon>{item.icon}</Icon>
                                <span className="flex-1">{item.label}</span>
                                {item.badge && (
                                    <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${item.amber ? 'bg-amber-200 text-amber-900' : 'bg-neutral-200 text-neutral-700'}`}>
                                        {item.badge}
                                    </span>
                                )}
                            </a>
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
                            <Icon><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5M21 12H9" /></Icon>
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
                        <Icon className="h-5 w-5"><path d="M4 6h16M4 12h16M4 18h16" /></Icon>
                    </button>

                    <label className="relative min-w-0 flex-1 md:max-w-sm lg:max-w-md">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                            <Icon><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></Icon>
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
                            <Icon className="h-3.5 w-3.5"><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M3 10h18M8 2v4M16 2v4" /></Icon>
                            Today: Oct 24, 2026
                            <Icon className="h-3.5 w-3.5 text-neutral-500"><path d="m6 9 6 6 6-6" /></Icon>
                        </button>

                        <button className="relative rounded-md p-2 text-neutral-700 hover:bg-neutral-100" aria-label="Notifications">
                            <Icon className="h-5 w-5"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0" /></Icon>
                            <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-bold text-white">3</span>
                        </button>

                        <button className="hidden items-center gap-1.5 rounded-md border border-neutral-300 bg-white px-3 py-2 text-[11px] font-semibold uppercase tracking-wide hover:bg-neutral-100 sm:flex">
                            Storefront
                            <Icon className="h-3.5 w-3.5"><path d="M7 17 17 7" /><path d="M8 7h9v9" /></Icon>
                        </button>

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