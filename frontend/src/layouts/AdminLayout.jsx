import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu } from 'lucide-react'
import AdminSideBar from '../components/admin-components/AdminSideBar'

const AdminLayout = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className='flex h-screen overflow-hidden bg-gray-50 font-sans'>
      <AdminSideBar isOpen={isOpen} setIsOpen={setIsOpen} />
      <main className='min-w-0 flex-1 overflow-y-auto'>
        <div className='border-b border-gray-200 bg-white p-3 lg:hidden'>
          <button
            type='button'
            onClick={() => setIsOpen(true)}
            className='rounded-md p-2 text-gray-700 hover:bg-gray-100'
            aria-label='Open admin navigation'
            aria-controls='admin-sidebar'
            aria-expanded={isOpen}
          >
            <Menu size={22} />
          </button>
        </div>
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout