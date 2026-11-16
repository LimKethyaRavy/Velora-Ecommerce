import React, { useEffect, useState } from "react";
import { getProduct } from "../../../service/productService";
import ProductCardSkeleton from "./ProductCardSkeleton";

const formatPrice = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value ?? 0));

const ProductTrending = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchTrendingProducts = async () => {
      try {
        const response = await getProduct({ tag: "trending" });
        const paginator = response?.data;
        const rows = Array.isArray(paginator?.data)
          ? paginator.data
          : Array.isArray(paginator)
            ? paginator
            : [];

        if (active) {
          setProducts(rows);
        }
      } catch (requestError) {
        if (active) {
          setError(
            requestError?.response?.data?.message ??
              requestError?.message ??
              "Could not load trending products.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchTrendingProducts();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="container mx-auto px-4 py-10">
      <h2 className="mb-6 text-2xl font-bold">Trending Products</h2>

      {error ? (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))
          ) : products.length === 0 ? (
            <p className="col-span-full text-sm text-gray-500">
              No trending products found.
            </p>
          ) : (
            products.map((product) => {
              const primaryImage =
                product.primary_image ??
                product.product_image?.find((image) => image.is_primary) ??
                product.product_image?.[0];
              const imageUrl =
                primaryImage?.public_url ?? primaryImage?.image_url;

              return (
                <article
                  key={product.id}
                  className="overflow-hidden rounded-lg border border-gray-200 bg-white"
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="aspect-[3/4] w-full object-cover"
                    />
                  ) : (
                    <div className="flex aspect-[3/4] items-center justify-center bg-gray-100 text-sm text-gray-400">
                      No image available
                    </div>
                  )}
                  <div className="space-y-1 p-3">
                    <h3 className="line-clamp-2 font-medium text-gray-900">
                      {product.name}
                    </h3>
                    <p className="text-sm font-semibold text-gray-700">
                      {formatPrice(product.base_price)}
                    </p>
                  </div>
                </article>
              );
            })
          )}
        </div>
      )}
    </section>
  );
};

export default ProductTrending;
