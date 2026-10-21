import React from 'react'
import { Link, Outlet } from 'react-router-dom'

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <header className="border-b border-neutral-200 px-6 py-4">
        <Link to="/" className="font-semibold tracking-wide">VELORA</Link>
      </header>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  )
}

export default PublicLayout
