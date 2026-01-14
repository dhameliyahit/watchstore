import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import {
  Star,
  Check,
  Heart,
  ShoppingBag,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import { getProductById, getProducts } from "../api/products";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Layout from "../layout/Layout";

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addItem } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getProductById(id);
        setProduct(res);

        if (res?.brand) {
          const relRes = await getProducts({ brand: res.brand, limit: 4 });
          setRelated((relRes.items || []).filter((p) => p._id !== id));
        }
      } catch {
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please login to add items to your cart");
      return;
    }
    if (adding) return;
    if (!product) return;

    setAdding(true);
    try {
      await addItem(product._id, 1);
      toast.success("Product added to cart");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Unable to add product to cart"
      );
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-white animate-pulse" />;
  if (!product) return <div className="py-20 text-center">Product Not Found</div>;

  return (
    <Layout>
      <div className="bg-white min-h-screen text-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* IMAGE GALLERY */}
            <div className="lg:col-span-7 space-y-5">
              <div className="relative group">
                <Swiper
                  modules={[Navigation, Thumbs]}
                  navigation={{
                    nextEl: ".btn-next",
                    prevEl: ".btn-prev",
                  }}
                  thumbs={{
                    swiper:
                      thumbsSwiper && !thumbsSwiper.destroyed
                        ? thumbsSwiper
                        : null,
                  }}
                  onSlideChange={(swiper) =>
                    thumbsSwiper?.slideTo(swiper.activeIndex)
                  }
                  className="h-[60vh] rounded-2xl border bg-[#fafafa]"
                >
                  {product.images.map((img, i) => (
                    <SwiperSlide key={i}>
                      <img
                        src={img}
                        alt={product.name}
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* NAV BUTTONS */}
                <NavButton direction="prev">
                  <ChevronLeft />
                </NavButton>
                <NavButton direction="next">
                  <ChevronRight />
                </NavButton>
              </div>

              {/* THUMBNAILS */}
              <Swiper
                onSwiper={setThumbsSwiper}
                slidesPerView={4}
                spaceBetween={12}
                watchSlidesProgress
                slideToClickedSlide
                modules={[Thumbs]}
              >
                {product.images.map((img, i) => (
                  <SwiperSlide key={i}>
                    {({ isActive }) => (
                      <div
                        className={`aspect-square rounded-xl overflow-hidden border-2 transition ${
                          isActive
                            ? "border-black shadow-md"
                            : "border-transparent opacity-40 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={img}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* PRODUCT INFO */}
            <div className="lg:col-span-5 space-y-10">
              {/* HEADER */}
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-black">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={16} fill="black" />
                  ))}
                  <span className="ml-2 text-xs text-gray-500">
                    4.8 Premium Reviews
                  </span>
                </div>

                <h1 className="text-5xl font-semibold tracking-tight">
                  {product.brand} {product.name}
                </h1>

                <div className="space-y-2 pt-2">
                  <Feature text="Certified Master Chronometer" />
                  <Feature text={`Movement: ${product.movement}`} />
                  <Feature text={`${product.waterResistance} Water Resistance`} />
                </div>
              </div>

              {/* PRICE + CTA */}
              <div className="space-y-4 pt-6 border-t">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-400">
                      Price
                    </p>
                    <p className="text-3xl font-semibold">
                      {product.currency} {product.price}
                    </p>
                  </div>

                  <button className="w-12 h-12 cursor-pointer rounded-full border flex items-center justify-center hover:border-black">
                    <Heart size={20} />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={adding}
                  className="w-full cursor-pointer bg-[#0a251a] text-white py-5 rounded-full font-semibold text-lg hover:opacity-90 active:scale-[0.98] transition disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <ShoppingBag className="inline mr-2" size={18} />
                  {adding ? "Adding..." : "Add to Cart"}
                </button>

                {!user && (
                  <p className="text-xs text-red-500 font-semibold uppercase tracking-widest text-center">
                    Login required for adding items to cart
                  </p>
                )}
                <button
                  onClick={() =>
                    window.open(
                      `https://wa.me/+919638601192?text=Inquiry for ${product.brand} ${product.name}`
                    )
                  }
                  className="w-full border py-4 rounded-full font-medium hover:bg-gray-50 flex items-center justify-center gap-2"
                >
                  <MessageCircle size={18} />
                  WhatsApp Inquiry
                </button>

                <p className="text-center text-xs text-gray-400 uppercase tracking-widest font-semibold">
                  Secure White-Glove Delivery
                </p>
              </div>

              {/* SPECS */}
              <div className="pt-6 border-t space-y-4">
                <details open>
                  <summary className="font-semibold uppercase text-sm cursor-pointer">
                    Specifications
                  </summary>
                  <div className="grid grid-cols-2 gap-4 pt-4 text-sm">
                    <Spec label="Case Size" value={`${product.caseSize}mm`} />
                    <Spec label="Material" value={product.caseMaterial} />
                    <Spec label="Strap" value={product.strapMaterial} />
                    <Spec label="Gender" value={product.gender} />
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

/* ---------- SUB COMPONENTS ---------- */

const Feature = ({ text }) => (
  <div className="flex items-center gap-3">
    <div className="bg-[#0a251a] rounded-full p-1">
      <Check size={12} color="white" strokeWidth={3} />
    </div>
    <span className="text-sm text-gray-700">{text}</span>
  </div>
);

const Spec = ({ label, value }) => (
  <div>
    <p className="text-[10px] uppercase text-gray-400">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);

const NavButton = ({ direction, children }) => (
  <button
    className={`btn-${direction} absolute top-1/2 ${
      direction === "prev" ? "left-4" : "right-4"
    } -translate-y-1/2 w-11 h-11 rounded-full bg-white border flex items-center justify-center hover:border-black transition`}
  >
    {children}
  </button>
);

export default ProductDetailPage;
