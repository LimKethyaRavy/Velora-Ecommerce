import React from "react";

import { useNavigate, useParams } from "react-router-dom";

import { ArrowLeft, LoaderCircle, Package, AlertCircle } from "lucide-react";

import Swal from "sweetalert2";

import ProductForm from "../../../components/admin/ProductForm";
import { updateProduct } from "../../../api/product";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await updateProduct(id);

        const productData = response?.data?.data ?? response?.data ?? response;

        if (!productData) {
          throw new Error("Prodcut not found");
        }

        if (isMounted) {
          setProduct(productData);
        }
      } catch (error) {
        console.log(error);

        if (isMounted) {
          setError(
            error?.response?.data?.message ??
              error?.message ??
              "Something went wrong",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fectchProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleBack = () => {
    navigate("/admin/products");
  };

  if (loading) {
    return (
      <div>
        <div classname="flex min-h-[70px] flex-col items-center justify-center gap-4 bg-gray-50 p-4 sm:p-6 lg:p-8">

            <LoaderCircle size={40} className="animate-spin text-gray-500" />

            <p className="text-sm font-medium text-gray-500">

                Loading product information...


            </p>
        </div>
      </div>
    );
  }

  if(error || !product) {

    return (
        <div className="flex min-h-[70vh] items-center justify-center p-6">
            
            <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">

                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">

                    <AlertCircle size={28} className="text-red-500" />

                </div>

                <h2 className="text-xl font-semibold text-gray-900">

                    Product Not Found

                </h2>

                <p className="mt-2 text-sm text-gray-500">

                    {error || "The product you are looking for does not exist."}

                </p>

                <button type="button"
                onClick={handleBack}
                className="mt-6 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
                >

                    <ArrowLeft size={20} className="mr-2 inline-block" />


                  Back to Products
                   
                </button>

                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                    <div>

                        <div className="mb-2 flex items-center gap-3">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100">

                                <Package size={22} className="text-violet-600" />

                            </div>

                            <div>

                                <h1 className="text-2xl font-bold tracking-light text-gray-900 sm:text-3xl">

                                    Edit Product

                                </h1>

                                <p className="mt-1 text-sm text-gray-500">

                                    Update your product information and inventory

                                </p>

                            </div>

                        </div>

                        <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">

                            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">

                                Product ID

                            </p>

                            <p className="mt-1 font-semibold text-gray-900">

                                #{product.id}

                            </p>

                        </div>

                    </div>

                    <ProductForm mode="edit" product={product} />



               </div>


            </div>

        </div>


    )

  }

};

export default EditProduct;
