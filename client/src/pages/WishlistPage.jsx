import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getWishlist, removeWishlistItem } from "../api/wishlist";
import { useAuth } from "../context/AuthContext.jsx";
import Layout from "../layout/Layout";

const WishlistPage = () => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const loadWishlist = async () => {
      const data = await getWishlist();
      setWishlist(data);
      setLoading(false);
    };
    loadWishlist();
  }, [user]);

  const handleRemove = async (productId) => {
    const data = await removeWishlistItem(productId);
    setWishlist(data);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-semibold mb-6">Wishlist</h1>
        {!user ? (
          <p className="text-gray-500">Login to view your wishlist.</p>
        ) : loading ? (
          <div className="h-40 bg-gray-100 rounded-2xl animate-pulse" />
        ) : wishlist?.items?.length ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.items.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
              >
                <Link to={`/product/${product._id}`}>
                  <img
                    src={product.images?.[0] || "/asset/heo.png"}
                    alt={product.name}
                    className="w-full h-52 object-cover"
                  />
                </Link>
                <div className="p-4">
                  <p className="text-xs uppercase tracking-widest text-gray-400">
                    {product.brand}
                  </p>
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-gray-500">₹{product.price}</p>
                  <button
                    onClick={() => handleRemove(product._id)}
                    className="mt-3 text-xs uppercase tracking-widest text-red-500"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Your wishlist is empty.</p>
        )}
      </div>
    </Layout>
  );
};

export default WishlistPage;
