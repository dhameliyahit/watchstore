import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import { getFeaturedDrops } from "../api/featuredDrops";
import { getProducts } from "../api/products";
import { addWishlistItem } from "../api/wishlist";
import { useAuth } from "../context/AuthContext.jsx";
import Layout from "../layout/Layout";

const HomePage = () => {
  const [featuredDrops, setFeaturedDrops] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [wishlistLoadingId, setWishlistLoadingId] = useState(null);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      const [dropsResp, productsResp] = await Promise.all([
        getFeaturedDrops(),
        getProducts({ limit: 6, sort: "newest" }),
      ]);
      setFeaturedDrops(dropsResp || []);
      setBestSellers(productsResp.items || []);
      setLoading(false);
    };
    loadContent();
  }, []);

  const handleWishlist = async (productId) => {
    if (!user) {
      toast.error("Login to save wishlist");
      return;
    }
    setWishlistLoadingId(productId);
    try {
      await addWishlistItem(productId);
      toast.success("Added to wishlist");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Unable to add to wishlist"
      );
    } finally {
      setWishlistLoadingId(null);
    }
  };

  return (
    <Layout>
      <HeroSection />
      <FeaturedDropsSection drops={featuredDrops} loading={loading} />
      <DynamicCollection
        products={bestSellers}
        onWishlist={handleWishlist}
        wishlistLoadingId={wishlistLoadingId}
        loading={loading}
      />
      <ScrollingBanner />
      <ReviewsSection />
    </Layout>
  );
};

const HeroSection = () => (
  <section className="relative py-10 w-full bg-[#F3F4F6] overflow-hidden min-h-125 lg:h-[80vh] flex items-center">
    <div
      className="absolute inset-0 z-0 bg-cover bg-center opacity-50"
      style={{ backgroundImage: "url('/asset/hero-bg.png')" }}
    />

    <div className="container mx-auto px-6 relative z-10">
      <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12">
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-125 lg:max-w-none">
            <img
              className="w-full borh-auto object-contain transition-transform duration-700"
              src="/asset/heo.png"
              alt="Luxury Watch"
            />
          </div>
        </div>
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
          <div className="mb-2">
            <span className="text-3xl font-serif tracking-widest text-[#1a4a36] font-bold">
              ROLEX
            </span>
            <div className="flex justify-center lg:justify-start">
              <div className="w-8 h-px bg-[#1a4a36] mt-1"></div>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-800 leading-tight">
            It Doesn't Just Tell Time. <br />
            <span className="italic">It Tells History!</span>
          </h1>

          <div className="flex gap-4 flex-wrap">
            <Link
              to="/shop"
              className="px-8 py-3 bg-gray-900 text-white rounded-full text-xs uppercase tracking-[0.4em] transition-colors cursor-pointer"
            >
              Shop the library
            </Link>
            <Link
              to="/account"
              className="px-8 py-3 border border-gray-900 text-gray-900 rounded-full text-xs uppercase tracking-[0.4em] cursor-pointer"
            >
              Manage collection
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const FeaturedDropsSection = ({ drops, loading }) => (
  <Link to="/drops">
    <section className="max-w-6xl mx-auto px-4 py-12 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.6em] text-gray-500">
            Limited
          </p>
          <h2 className="text-3xl font-semibold">Featured Drops</h2>
        </div>
        <Link
          to="/drops"
          className="text-xs uppercase tracking-[0.4em] text-gray-600 hover:text-black cursor-pointer"
        >
          Explore all
        </Link>
      </div>
      {loading ? (
        <div className="grid md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-44 bg-gray-100 rounded-3xl animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {drops.slice(0, 3).map((drop) => (
            <article
              key={drop._id}
              className="rounded-3xl border border-gray-100 bg-white p-6 space-y-2 shadow-sm hover:shadow-xl transition cursor-pointer"
            >
              <p className="text-xs uppercase tracking-[0.6em] text-gray-500">
                {drop.products?.length || 0} watches
              </p>
              <h3 className="text-2xl font-semibold">{drop.title}</h3>
              <p className="text-sm text-gray-500">{drop.description}</p>
              <Link
                to="/drops"
                className="text-xs uppercase tracking-[0.4em] text-black"
              >
                View drop
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  </Link>
);

const DynamicCollection = ({
  products,
  onWishlist,
  wishlistLoadingId,
  loading,
}) => (
  <section className="max-w-6xl mx-auto px-4 py-12 space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.6em] text-gray-500">
          Collection
        </p>
        <h2 className="text-3xl font-semibold">New arrivals</h2>
      </div>
      <Link
        to="/shop"
        className="text-xs uppercase tracking-[0.4em] text-gray-600 hover:text-black cursor-pointer"
      >
        View catalog
      </Link>
    </div>
    {loading ? (
      <div className="grid md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-80 bg-gray-100 rounded-3xl animate-pulse"
          />
        ))}
      </div>
    ) : (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="group rounded-3xl border border-gray-100 bg-white overflow-hidden shadow-sm hover:shadow-xl transition cursor-pointer"
          >
            <Link to={`/product/${product._id}`}>
              <div className="h-56 w-full bg-gray-100 overflow-hidden">
                <img
                  src={product.images?.[0] || "/asset/heo.png"}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            </Link>
            <div className="p-5 space-y-2">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
                {product.brand}
              </p>
              <p className="text-sm text-gray-600">
                {product.movement || "Movement"} • {product.caseSize || 40}mm
              </p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">₹{product.price}</span>
                <button
                  onClick={(event) => {
                    event.preventDefault();
                    onWishlist(product._id);
                  }}
                  disabled={!product._id || wishlistLoadingId === product._id}
                  className="text-xs uppercase tracking-[0.4em] text-gray-600 hover:text-black cursor-pointer"
                >
                  {wishlistLoadingId === product._id ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </section>
);

const ScrollingBanner = () => {
  const scrollText = "Introducing Auriglo's Premium iWatch cases";
  const items = useMemo(() => Array(10).fill(scrollText), []);

  return (
    <div className="bg-[#f3f3f3] py-4 overflow-hidden whitespace-nowrap border-y border-gray-200">
      <div className="flex animate-marquee">
        {items.map((text, index) => (
          <div key={index} className="flex items-center">
            <span className="text-xl md:text-2xl font-black text-black px-8 uppercase tracking-tight">
              {text}
            </span>
            <span className="w-2 h-2 bg-black rounded-full mx-4"></span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: fit-content;
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
};

const REVIEWS = [
  {
    id: 1,
    name: "Shaurya Arora",
    rating: 5,
    text: "Love my Auriglo iWatch case! Top-notch quality and style. Elevate your watch game and get yours today!",
  },
  {
    id: 2,
    name: "Rohan Mehta",
    rating: 5,
    text: "Premium build quality and a perfect fit. Looks elegant and feels luxurious on the wrist.",
  },
  {
    id: 3,
    name: "Ananya Singh",
    rating: 4,
    text: "Beautiful design and solid finish. Totally worth the price!",
  },
];

const ReviewsSection = () => {
  const [index, setIndex] = useState(0);
  const review = REVIEWS[index];

  const prev = () =>
    setIndex((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length);
  const next = () => setIndex((prev) => (prev + 1) % REVIEWS.length);

  return (
    <section className="bg-[#f7f6f3] py-20 px-6 sm:py-28">
      <div className="max-w-4xl mx-auto relative">
        <div className="flex justify-center mb-2">
          <Quote size={48} className="text-gray-300" />
        </div>
        <div className="text-center">
          <div className="flex justify-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={18}
                className={
                  i < review.rating ? "text-orange-400" : "text-gray-300"
                }
              />
            ))}
          </div>
          <p className="text-2xl md:text-3xl font-medium text-gray-900 leading-snug">
            "{review.text}"
          </p>
          <p className="mt-6 text-sm font-semibold tracking-widest uppercase text-gray-500">
            ƒ?" {review.name}
          </p>
        </div>
        <div className="mt-12 flex flex-col items-center gap-8">
          <div className="flex gap-2.5">
            {REVIEWS.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-1.5 transition-all duration-300 rounded-full ${
                  i === index
                    ? "w-8 bg-gray-900"
                    : "w-1.5 bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={prev}
              className="p-3 rounded-full border border-gray-300 bg-white hover:border-gray-900 hover:text-gray-900 transition cursor-pointer"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              className="p-3 rounded-full border border-gray-300 bg-white hover:border-gray-900 hover:text-gray-900 transition cursor-pointer"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePage;
