import React from 'react'
import AdminLayout from './layouts/AdminLayout'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout'
import ProductFeature from './page/admin/ProductFeature'
import Dashboard from './page/admin/Dashboard'
import Supplier from './page/admin/Supplier'
import Category from './page/admin/Category'

const AdminSection = ({ title }) => (
  <section>
    <h1 className="text-2xl font-semibold">{title}</h1>
    <p className="mt-1 text-sm text-neutral-500">This section is ready for its content.</p>
  </section>
)

const App = () => {
  return (
    <div>
        <BrowserRouter>

        <Routes>

          <Route path='/' element={<PublicLayout/>}>
            <Route index element={<h1 className="text-2xl font-semibold">Welcome to Velora</h1>} />
          </Route>

          <Route path='/admin' element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path='products' element={<ProductFeature/>} />
            <Route path='suppliers' element={<Supplier/>} />
            <Route path='categories' element={<Category/>} />
            <Route path='orders' element={<AdminSection title='Orders' />} />
            <Route path='payments' element={<AdminSection title='Payments' />} />
            <Route path='users' element={<AdminSection title='Users' />} />
            <Route path='settings' element={<AdminSection title='Settings' />} />
          </Route>

        </Routes>
        </BrowserRouter>
    </div>
  )
}

export default App
