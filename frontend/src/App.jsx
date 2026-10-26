import './App.css'
import AdminLayout from './layouts/AdminLayout'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from './page/admin/Dashboard';
import ProductFeature from './page/admin/ProductFeature';
import Supplier from './page/admin/Supplier';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="productfeature" element={<ProductFeature />} />
          <Route path="supplier" element={<Supplier />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
