import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import Layout from "../layout/Layout";

const CartPage = () => {
  const { cart, loading, updateItem, removeItem } = useCart();
  const navigate = useNavigate();

  const items = cart?.items || [];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-semibold mb-6">Your Cart</h1>

        {loading ? (
          <div className="h-40 bg-gray-100 rounded-2xl animate-pulse" />
        ) : items.length === 0 ? (
          <div className="text-gray-500">
            Your cart is empty. <Link to="/shop" className="underline">Shop now</Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.product}
                  className="flex flex-col sm:flex-row gap-4 bg-white rounded-2xl border border-gray-100 p-4"
                >
                  <img
                    src={item.image || "/asset/heo.png"}
                    alt={item.name}
                    className="w-full sm:w-32 h-32 object-cover rounded-xl"
                  />
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-widest text-gray-400">
                      {item.brand || "Watch"}
                    </p>
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-500">₹{item.price}</p>
                    <div className="mt-3 flex items-center gap-3">
                      <button
                        className="px-3 py-1 rounded-full border"
                        onClick={() => updateItem(item.product, Math.max(1, item.quantity - 1))}
                      >
                        -
                      </button>
                      <span className="text-sm">{item.quantity}</span>
                      <button
                        className="px-3 py-1 rounded-full border"
                        onClick={() => updateItem(item.product, item.quantity + 1)}
                      >
                        +
                      </button>
                      <button
                        className="ml-auto text-xs uppercase tracking-widest text-red-500"
                        onClick={() => removeItem(item.product)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 h-fit">
              <h2 className="text-lg font-semibold mb-4">Summary</h2>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Items</span>
                <span>{cart.itemCount}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>Subtotal</span>
                <span>₹{cart.subtotal}</span>
              </div>
              <button
                onClick={() => navigate("/checkout")}
                className="w-full mt-6 bg-black text-white py-3 rounded-xl font-medium"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CartPage;
