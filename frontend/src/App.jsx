import './App.css'
import AdminLayout from './layouts/AdminLayout'
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import Dashboard from './page/admin/Dashboard';
import ProductFeature from './page/admin/products/ProductFeature';
import Supplier from './page/admin/Supplier';
import Category from './page/admin/Category';
import Order from './page/admin/Order';
import ProductForm from './components/admin-components/ProductForm';
import { getCategory } from './service/categoryService';
import { getSupplier } from './service/supplierService';
import { showProduct } from './service/productService';
import LoginScreen from './page/admin/auth/LoginScreen';
import AuthContext from './context/AuthContext';

function ProductFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFormData = async () => {
      try {
        const [categoryResponse, supplierResponse] = await Promise.all([
          getCategory({ page: 1, search: '' }),
          getSupplier(),
        ]);

        setCategories(Array.isArray(categoryResponse?.data) ? categoryResponse.data : categoryResponse?.data?.data ?? []);
        setSuppliers(Array.isArray(supplierResponse?.data) ? supplierResponse.data : supplierResponse?.data?.data ?? []);

        if (isEdit) {
          const productResponse = await showProduct(id);
          setInitialValues(productResponse?.data ?? productResponse);
        }
      } catch (error) {
        console.error('Failed to load product form data', error);
      } finally {
        setLoading(false);
      }
    };

    loadFormData();
  }, [id, isEdit]);

  if (loading) {
    return <div className="flex min-h-[200px] items-center justify-center text-sm text-slate-500">Loading product form...</div>;
  }

  return (
    <ProductForm
      mode={isEdit ? 'edit' : 'create'}
      productId={id}
      initialValues={initialValues}
      categories={categories}
      suppliers={suppliers}
      onClose={() => navigate('/admin/products')}
      onSuccess={() => navigate('/admin/products')}
    />
  );
}

function App() {
  return (
    <BrowserRouter>

  
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/admin/login" replace />}
        />

 
        <Route
          path="/admin/login"
          element={<LoginScreen />}
        />

  
        <Route path="/admin" element={<AdminLayout />}>

          {/* Default admin route */}
          <Route
            index
            element={<Navigate to="/admin/login" replace />}
          />

          <Route path="dashboard" element={<Dashboard />} />

          <Route path="products" element={<ProductFeature />} />

          <Route path="products/create" element={<ProductFormPage />} />

          <Route path="products/:id/edit" element={<ProductFormPage />} />

          <Route
            path="productfeature"
            element={<Navigate to="/admin/products" replace />}
          />

          <Route path="supplier" element={<Supplier />} />

          <Route path="category" element={<Category />} />

          <Route path="order" element={<Order />} />

        </Route>

       
      </Routes>

  
    </BrowserRouter>
  )
} 

export default App
