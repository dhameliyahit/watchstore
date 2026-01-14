import { useState } from "react";
import toast from "react-hot-toast";
import Layout from "../layout/Layout";
import { checkout } from "../api/orders";
import { initiateCashfree } from "../api/cashfree";
import { validateCoupon } from "../api/coupon";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const CheckoutPage = () => {
  const { user } = useAuth();
  const { cart, clear } = useCart();

  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponLabel, setCouponLabel] = useState("");

  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    streetAddr: user?.streetAddr || "",
    city: user?.city || "",
    state: user?.state || "",
    postalCode: user?.postalCode || "",
    country: user?.country || "",
    phone: "",
  });

  const handleChange = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const finalTotal = Math.max((cart?.subtotal || 0) - discount, 0);

  /* ---------------- COUPON ---------------- */
  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Enter a coupon code");
      return;
    }
    try {
      const data = await validateCoupon({
        code: couponCode,
        orderAmount: cart?.subtotal || 0,
      });
      setDiscount(data.discount);
      setCouponLabel(data.code);
      setCouponError("");
      toast.success("Coupon applied");
    } catch (err) {
      const msg = err?.response?.data?.message || "Invalid coupon";
      setCouponError(msg);
      setDiscount(0);
      setCouponLabel("");
      toast.error(msg);
    }
  };

  /* ---------------- CHECKOUT ---------------- */
  const handleCheckout = async () => {
    if (!form.phone.trim()) {
      toast.error("Phone number is required");
      return;
    }
    if (!cart?.items?.length) {
      toast.error("Your cart is empty");
      return;
    }

    setLoading(true);
    try {
      const data = await checkout({
        shippingAddress: form,
        paymentMethod: "cashfree",
        coupon: couponLabel || undefined,
        finalAmount: finalTotal, // ✅ IMPORTANT
      });

      setOrder(data);
      await clear();
      toast.success("Order created");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- PAYMENT ---------------- */
  const handleCashfree = async () => {
    try {
      const data = await initiateCashfree(order._id);
      window.open(data.paymentLink, "_blank");
    } catch (err) {
      console.log(err);
      toast.error("Payment initiation failed");
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-10">Checkout</h1>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* ---------------- SHIPPING ---------------- */}
          <div className="bg-white rounded-3xl border border-gray-200 p-8">
            <h2 className="text-xl font-semibold mb-6">Shipping Details</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="First Name" value={form.firstName} onChange={(v) => handleChange("firstName", v)} />
              <Input label="Last Name" value={form.lastName} onChange={(v) => handleChange("lastName", v)} />
            </div>

            <Input label="Street Address" value={form.streetAddr} onChange={(v) => handleChange("streetAddr", v)} />

            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="City" value={form.city} onChange={(v) => handleChange("city", v)} />
              <Input label="State" value={form.state} onChange={(v) => handleChange("state", v)} />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Postal Code" value={form.postalCode} onChange={(v) => handleChange("postalCode", v)} />
              <Input label="Country" value={form.country} onChange={(v) => handleChange("country", v)} />
            </div>

            <Input label="Phone *" value={form.phone} onChange={(v) => handleChange("phone", v)} />
          </div>

          {/* ---------------- SUMMARY ---------------- */}
          <div className="bg-white rounded-3xl border border-gray-200 p-8 h-fit">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

            <div className="space-y-3 text-sm">
              {cart?.items?.map((item) => (
                <div key={item.product} className="flex justify-between text-gray-600">
                  <span>{item.name} × {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="border-t my-6" />

            <Row label="Subtotal" value={`₹${cart?.subtotal || 0}`} />
            {discount > 0 && (
              <Row label={`Discount (${couponLabel})`} value={`-₹${discount}`} highlight />
            )}
            <Row label="Total Payable" value={`₹${finalTotal}`} bold />

            {/* Coupon */}
            <div className="mt-6">
              <label className="text-xs uppercase tracking-widest text-gray-400 mb-2 block">
                Coupon Code
              </label>
              <div className="flex gap-3">
                <input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon"
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm"
                />
                <button
                  onClick={applyCoupon}
                  className="bg-black text-white px-5 rounded-xl text-xs uppercase tracking-widest"
                >
                  Apply
                </button>
              </div>
              {couponError && (
                <p className="text-xs text-red-500 mt-2">{couponError}</p>
              )}
            </div>

            {/* CTA */}
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full mt-8 bg-black text-white py-3 rounded-xl font-semibold hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Processing..." : `Place Order • ₹${finalTotal}`}
            </button>

            {order && (
              <button
                onClick={handleCashfree}
                className="w-full mt-4 bg-green-600 text-white py-3 rounded-xl font-semibold"
              >
                Continue to Payment
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

/* ---------------- UI HELPERS ---------------- */

const Input = ({ label, value, onChange }) => (
  <div className="mt-4">
    <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">
      {label}
    </label>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:ring-2 focus:ring-black focus:outline-none"
    />
  </div>
);

const Row = ({ label, value, highlight, bold }) => (
  <div className={`flex justify-between text-sm ${bold ? "font-semibold" : "text-gray-600"} ${highlight ? "text-green-600" : ""}`}>
    <span>{label}</span>
    <span>{value}</span>
  </div>
);

export default CheckoutPage;
