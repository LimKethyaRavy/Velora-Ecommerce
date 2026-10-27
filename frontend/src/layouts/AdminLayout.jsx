import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AdminSideBar from '../components/admin-components/AdminSideBar'
import AdminNavbar from '../components/admin-components/AdminNavbar'

const AdminLayout = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className='flex h-screen overflow-hidden bg-gray-50 font-sans'>

      <AdminSideBar isOpen={isOpen} setIsOpen={setIsOpen} />

      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-label="Close admin navigation"
        />
      )}

      <div className='flex flex-1 flex-col min-w-0 overflow-hidden'>
        <AdminNavbar isOpen={isOpen} setIsOpen={setIsOpen} />

        <main className='flex-1 overflow-y-auto p-4 lg:p-6'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout