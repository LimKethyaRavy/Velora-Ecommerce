import React, { useCallback, useEffect, useState } from "react";
import { getProduct } from "../../../service/productService";
import ProductCardSkeleton from "./ProductCardSkeleton";

const formatPrice = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value ?? 0));

/* ---------- Icons (inline SVG, no extra dependency) ---------- */
const HeartIcon = ({ filled }) => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
  </svg>
);

const CartIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
  </svg>
);

const CheckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

/* ---------- Color swatches ----------
   Reads product.colors (array of "#hex" strings or objects such as
   { name, hex } / { name, color_code }). Renders nothing if there are none. */
const MAX_SWATCHES = 4;

const getSwatch = (color) => {
  if (typeof color === "string") return { value: color, name: color };
  return {
    value: color?.hex ?? color?.color_code ?? color?.value ?? color?.name,
    name: color?.name ?? color?.hex ?? color?.color_code ?? "",
  };
};

const ColorSwatches = ({ colors }) => {
  if (!Array.isArray(colors) || colors.length === 0) return null;

  const visible = colors.slice(0, MAX_SWATCHES).map(getSwatch);
  const extra = colors.length - MAX_SWATCHES;

  return (
    <ul
      className="flex items-center gap-1.5"
      aria-label={`${colors.length} colors available`}
    >
      {visible.map((swatch, index) => (
        <li
          key={`${swatch.value}-${index}`}
          title={swatch.name}
          className="h-4 w-4 rounded-full border border-gray-300"
          style={{ backgroundColor: swatch.value }}
        />
      ))}
      {extra > 0 && (
        <li className="text-xs font-medium text-gray-500">+{extra}</li>
      )}
    </ul>
  );
};

/* ---------- Product card ---------- */
const ProductCard = ({ product, isWishlisted, onToggleWishlist, onAddToCart }) => {
  const [added, setAdded] = useState(false);

  const primaryImage =
    product.primary_image ??
    product.product_image?.find((image) => image.is_primary) ??
    product.product_image?.[0];
  const imageUrl = primaryImage?.public_url ?? primaryImage?.image_url;

  // Optional second image shown on hover (falls back to the primary one)
  const secondaryImage = product.product_image?.find(
    (image) => image !== primaryImage,
  );
  const hoverImageUrl = secondaryImage?.public_url ?? secondaryImage?.image_url;

  const handleAddToCart = () => {
    onAddToCart?.(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow duration-300 hover:shadow-lg focus-within:shadow-lg">
      {/* Image area */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
        {imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt={product.name}
              loading="lazy"
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out ${
                hoverImageUrl ? "group-hover:opacity-0" : ""
              }`}
            />
            {hoverImageUrl && (
              <img
                src={hoverImageUrl}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
              />
            )}
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
            No image available
          </div>
        )}

        {/* Wishlist button: solid white circle, top right */}
        <button
          type="button"
          onClick={() => onToggleWishlist?.(product)}
          aria-pressed={isWishlisted}
          aria-label={
            isWishlisted
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          className={`absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-200 hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 ${
            isWishlisted ? "text-rose-500" : "text-gray-700 hover:text-rose-500"
          }`}
        >
          <HeartIcon filled={isWishlisted} />
        </button>

        {/* Desktop: slide-up add to cart (only on devices that support hover) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden p-3 transition-all duration-300 md:block [@media(hover:hover)]:translate-y-full [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-focus-within:translate-y-0 [@media(hover:hover)]:group-focus-within:opacity-100 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100">
          <button
            type="button"
            onClick={handleAddToCart}
            className={`pointer-events-auto flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
              added
                ? "bg-green-600 focus-visible:ring-green-600"
                : "bg-gray-900 hover:bg-gray-700 focus-visible:ring-gray-900"
            }`}
          >
            {added ? <CheckIcon /> : <CartIcon />}
            {added ? "Added" : "Add to cart"}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-3 sm:px-4 sm:pb-4 sm:pt-3.5">
        <h3 className="line-clamp-1 text-sm font-semibold text-gray-900 sm:text-base">
          {product.name}
        </h3>

        {product.description && (
          <p className="mt-1 line-clamp-1 text-xs text-gray-600 sm:text-sm">
            {product.description}
          </p>
        )}

        {/* Price left, color swatches right */}
        <div className="mt-2.5 flex items-center justify-between gap-2">
          <p className="text-sm font-bold text-red-600 sm:text-base">
            {formatPrice(product.base_price)}
          </p>
          <ColorSwatches colors={product.colors} />
        </div>

        {/* Mobile: always-visible add to cart */}
        <button
          type="button"
          onClick={handleAddToCart}
          className={`mt-3 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-white transition-colors duration-300 active:scale-95 md:hidden ${
            added ? "bg-green-600" : "bg-gray-900 hover:bg-gray-700"
          }`}
        >
          {added ? <CheckIcon /> : <CartIcon />}
          {added ? "Added" : "Add to cart"}
        </button>
      </div>
    </article>
  );
};

/* ---------- Section ---------- */
const ProductTrending = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [wishlist, setWishlist] = useState(() => new Set());

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

  // TODO: connect these to your real wishlist / cart API or context.
  const handleToggleWishlist = useCallback((product) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(product.id)) next.delete(product.id);
      else next.add(product.id);
      return next;
    });
  }, []);

  const handleAddToCart = useCallback((product) => {
    console.log("Add to cart:", product.id);
  }, []);

  return (
    <section className="container mx-auto px-4 py-8 sm:py-10">
      <h2 className="mb-5 text-xl font-bold sm:mb-6 sm:text-2xl">
        Trending Products
      </h2>

      {error ? (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))
          ) : products.length === 0 ? (
            <p className="col-span-full text-sm text-gray-500">
              No trending products found.
            </p>
          ) : (
            products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlist.has(product.id)}
                onToggleWishlist={handleToggleWishlist}
                onAddToCart={handleAddToCart}
              />
            ))
          )}
        </div>
      )}
    </section>
  );
};

export default ProductTrending;