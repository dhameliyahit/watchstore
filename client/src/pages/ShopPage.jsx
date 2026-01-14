import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { getProductFilters, getProducts } from "../api/products";
import { addWishlistItem } from "../api/wishlist";
import { useAuth } from "../context/AuthContext.jsx";
import Layout from "../layout/Layout";

const ShopPage = () => {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({
    brands: [],
    movements: [],
    strapMaterials: [],
    caseMaterials: [],
  });
  const [featuredDrops, setFeaturedDrops] = useState([]);
  const [query, setQuery] = useState({
    search: "",
    brand: "",
    movement: "",
    strapMaterial: "",
    caseMaterial: "",
    minPrice: "",
    maxPrice: "",
    sort: "newest",
  });
  const [loading, setLoading] = useState(true);
  const [wishlistLoadingId, setWishlistLoadingId] = useState(null);
  const { user } = useAuth();

  const params = useMemo(() => {
    const data = { ...query };
    Object.keys(data).forEach((key) => {
      if (data[key] === "") delete data[key];
    });
    return data;
  }, [query]);

  useEffect(() => {
    const loadData = async () => {
      const data = await getProductFilters();
      setFilters(data);
    };
    loadData();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const data = await getProducts(params);
      setItems(data.items || []);
      setLoading(false);
    };
    loadProducts();
  }, [params]);

  useEffect(() => {
    const loadDrops = async () => {
      const res = await fetch("/api/featured-drops");
      const data = await res.json();
      setFeaturedDrops(data || []);
    };
    loadDrops();
  }, []);

  const handleWishlist = async (productId, event) => {
    event.preventDefault();
    if (!user) {
      toast.error("Login to save wishlist");
      return;
    }
    setWishlistLoadingId(productId);
    try {
      await addWishlistItem(productId);
      toast.success("Added to wishlist");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to add wishlist");
    } finally {
      setWishlistLoadingId(null);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
        <section className="bg-linear-to-r from-gray-900 to-gray-800 rounded-3xl text-white p-8 space-y-4">
          <p className="text-xs uppercase tracking-[0.5em] text-gray-300">
            Discover
          </p>
          <h1 className="text-4xl md:text-5xl font-serif tracking-tight">
            Curated timepieces for every journey
          </h1>
          <p className="text-sm text-gray-300 max-w-2xl">
            Explore our handpicked collections, flash drops, and premium picks.
            Match your wrist with watches that balance heritage, precision, and
            modern story.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link
              to="/shop"
              className="px-6 py-3 bg-white text-black rounded-full text-xs uppercase tracking-[0.4em] cursor-pointer"
            >
              Shop all
            </Link>
            <Link
              to="/drops"
              className="px-6 py-3 border border-white rounded-full text-xs uppercase tracking-[0.4em] cursor-pointer"
            >
              View drops
            </Link>
          </div>
        </section>

        {featuredDrops.length > 0 && (
          <section>
            <div className="flex items-end justify-between mb-4">
              <h2 className="text-2xl font-semibold">Featured Drops</h2>
              <Link
                to="/drops"
                className="text-xs uppercase tracking-[0.4em] text-gray-600 hover:text-black cursor-pointer"
              >
                See all
              </Link>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredDrops.map((drop) => (
                <Link
                  key={drop._id}
                  to="/drops"
                  className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white cursor-pointer"
                >
                  <div className="p-6 space-y-3">
                    <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
                      {drop.startsAt && drop.endsAt
                        ? "Limited drop"
                        : "Featured"}
                    </p>
                    <h3 className="text-3xl font-semibold">{drop.title}</h3>
                    <p className="text-sm text-gray-500">{drop.description}</p>
                    <div className="text-xs uppercase tracking-[0.4em] text-gray-400">
                      {drop.products?.length || 0} watches
                    </div>
                  </div>
                  <div className="bg-linear-to-r from-black/10 via-transparent to-transparent p-6 text-xs text-white">
                    Launching soon
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-1/4 bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <h2 className="text-lg font-semibold">Filters</h2>
            <Input
              label="Search"
              value={query.search}
              onChange={(value) =>
                setQuery((prev) => ({ ...prev, search: value }))
              }
              placeholder="Search watches"
            />
            <Select
              label="Brand"
              value={query.brand}
              options={filters.brands}
              onChange={(value) =>
                setQuery((prev) => ({ ...prev, brand: value }))
              }
            />
            <Select
              label="Movement"
              value={query.movement}
              options={filters.movements}
              onChange={(value) =>
                setQuery((prev) => ({ ...prev, movement: value }))
              }
            />
            <Select
              label="Strap"
              value={query.strapMaterial}
              options={filters.strapMaterials}
              onChange={(value) =>
                setQuery((prev) => ({ ...prev, strapMaterial: value }))
              }
            />
            <Select
              label="Case"
              value={query.caseMaterial}
              options={filters.caseMaterials}
              onChange={(value) =>
                setQuery((prev) => ({ ...prev, caseMaterial: value }))
              }
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Min Price"
                type="number"
                value={query.minPrice}
                onChange={(value) =>
                  setQuery((prev) => ({ ...prev, minPrice: value }))
                }
              />
              <Input
                label="Max Price"
                type="number"
                value={query.maxPrice}
                onChange={(value) =>
                  setQuery((prev) => ({ ...prev, maxPrice: value }))
                }
              />
            </div>
          </aside>

          <section className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">All Watches</h2>
              <span className="text-sm text-gray-500">
                {loading ? "Loading..." : `${items.length} products`}
              </span>
            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-80 bg-gray-100 rounded-2xl animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.map((product) => (
                  <Link
                    key={product._id}
                    to={`/product/${product._id}`}
                    className="group relative bg-white rounded-3xl border border-gray-200 overflow-hidden transition hover:shadow-2xl"
                  >
                    {/* Image */}
                    <div className="relative h-60 overflow-hidden bg-gray-100">
                      <img
                        src={product.images?.[0] || "/asset/heo.png"}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />

                      {/* Stock Badge */}
                      {product.stock <= 0 && (
                        <span className="absolute top-4 left-4 bg-black text-white text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">
                          Sold Out
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      {/* Brand */}
                      <p className="text-[11px] uppercase tracking-[0.35em] text-gray-400">
                        {product.brand}
                      </p>

                      {/* Name & Price */}
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-lg font-semibold text-gray-900 leading-tight line-clamp-2">
                          {product.name}
                        </h3>
                        <span className="text-sm font-medium text-gray-900 whitespace-nowrap">
                          ₹{product.price}
                        </span>
                      </div>

                      {/* Meta */}
                      <p className="text-sm text-gray-500">
                        {product.movement || "Quartz"} •{" "}
                        {product.caseSize || "40"}mm
                      </p>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-2">
                        <button
                          type="button"
                          disabled={!user || wishlistLoadingId === product._id}
                          onClick={(event) =>
                            handleWishlist(product._id, event)
                          }
                          className="text-[11px] uppercase tracking-[0.35em] text-gray-500 hover:text-black transition disabled:opacity-50"
                        >
                          {wishlistLoadingId === product._id
                            ? "Saving..."
                            : "Save"}
                        </button>

                        <span
                          className={`text-[11px] uppercase tracking-[0.35em] ${
                            product.stock > 0
                              ? "text-emerald-600"
                              : "text-gray-400"
                          }`}
                        >
                          {product.stock > 0 ? "In Stock" : "Unavailable"}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </Layout>
  );
};

const Input = ({ label, value, onChange, type = "text", placeholder }) => (
  <div>
    <label className="block text-xs font-semibold uppercase tracking-[0.4em] text-gray-400 mb-2">
      {label}
    </label>
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
    />
  </div>
);

const Select = ({ label, value, options = [], onChange }) => (
  <div>
    <label className="block text-xs font-semibold uppercase tracking-[0.4em] text-gray-400 mb-2">
      {label}
    </label>
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
    >
      <option value="">All</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

export default ShopPage;
