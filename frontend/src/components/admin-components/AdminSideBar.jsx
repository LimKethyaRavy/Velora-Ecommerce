import React from 'react'


const AdminSideBar = () => {

    const sidebarLink = [
        {
    name: "Dashboard", path: "/admin/dashboard",
    name: "Prodcut", path: "/admin/productfeature",
    name: "Supplier", path: "/admin/supplier",
    name: "Category", path: "/admin/category",
    name: "Order", path: "/admin/order",
    name: "Payments", path: "/admin/payment",
    name:"Users", path: "/admin/user",
    name: "Setting", path: "/admin/setting" 
    


    }
]


  return (
    <div>

        <aside className='sticky top-0 h-screen w-64 shrink-0 border-r border-gray-200 bg-shite'>
            <div className='border-b border-gray-200 p-6'>
                <h1 className='font-serif text-2xl'>
                    VELORA
                </h1>

                <p className='text-xs tracking-widest text-gray-500'>

                    Alter admin

                </p>
            </div>

            <nav className='space-y-1'>
                
            </nav>


        </aside>

    </div>
  )
}

export default AdminSideBar