import React from 'react'

const AddProduct = () => {

  const navigate = useNavigate();

  return (
    <div>
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">

          <div className= "mx-auto max-w-7xl">
            
            <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <span
            onClick={() => navigate("/admin/products")}
            className="cursor-pointer hover:text-violet-600"
          >
            Products
          </span>

          <span>/</span>

          <span className="font-medium text-gray-900">
            Add Product
          </span>
        </div>

        {/* Page Header */}
        <div className="mb-8 flex items-center gap-4">

          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="rounded-xl border border-gray-200 bg-white p-3 transition hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Add New Product
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Create a new product for your Velora fashion store.
            </p>
          </div>

        </div>

        {/* Product Form */}
        <ProductForm mode="create" />

      </div>


          </div>
            
     </div>
   
  )
}

export default AddProduct