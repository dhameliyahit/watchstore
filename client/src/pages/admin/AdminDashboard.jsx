
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { getProducts } from "../../api/products";
import { getPolicy } from "../../api/policies";
import {
  cancelOrder,
  createCoupon,
  createGiftCard,
  createProduct,
  deleteCoupon,
  deleteProduct,
  getAllOrders,
  getCoupons,
  getGiftCards,
  markOrderDelivered,
  markOrderPaid,
  markOrderShipped,
  redeemGiftCard,
  refundOrder,
  updateCoupon,
  updateProduct,
  upsertPolicy,
} from "../../api/admin";
import { useAuth } from "../../context/AuthContext.jsx";
import Layout from "../../layout/Layout";
import AdminSidebar from "./AdminSidebar";
import AddProductSection from "./AddProduct";
import OrdersSection from "./OrdersSection";
import CouponsSection from "./CouponsSection";
import GiftCardsSection from "./GiftCardsSection";
import DropsSection from "./DropsSection";
import PoliciesSection from "./PoliciesSection";

const sections = [
  { id: "products", label: "Products" },
  { id: "orders", label: "Orders" },
  { id: "coupons", label: "Coupons" },
  { id: "giftcards", label: "Gift Cards" },
  { id: "drops", label: "Featured Drops" },
  { id: "policies", label: "Policies" },
];

const createEmptyCouponForm = () => ({
  code: "",
  discountType: "percent",
  value: "",
  minOrder: "",
  maxDiscount: "",
  expiresAt: "",
});

const createEmptyGiftCardForm = () => ({
  code: "",
  initialBalance: "",
  expiresAt: "",
});

const AdminDashboard = () => {
  const { user } = useAuth();
  const [active, setActive] = useState("products");
  const [loading, setLoading] = useState(true);

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [giftCards, setGiftCards] = useState([]);

  const [policyForm, setPolicyForm] = useState({
    warrantyInfo: "",
    authenticityInfo: "",
    returnsPolicy: "",
  });

  const [productForm, setProductForm] = useState({
    name: "",
    brand: "",
    price: "",
    stock: "",
    caseSize: "",
    movement: "",
    strapMaterial: "",
    caseMaterial: "",
    waterResistance: "",
    gender: "",
    categories: "",
    description: "",
  });
  const [productImages, setProductImages] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  const [couponForm, setCouponForm] = useState(createEmptyCouponForm);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const [giftCardForm, setGiftCardForm] = useState(createEmptyGiftCardForm);

  const loadSection = async (section) => {
    setLoading(true);
    try {
      if (section === "products") {
        const data = await getProducts({ limit: 200 });
        setProducts(data.items || []);
      }
      if (section === "orders") {
        const data = await getAllOrders();
        setOrders(data || []);
      }
      if (section === "coupons") {
        const data = await getCoupons();
        setCoupons(data || []);
      }
      if (section === "giftcards") {
        const data = await getGiftCards();
        setGiftCards(data || []);
      }
      if (section === "policies") {
        try {
          const data = await getPolicy("store");
          setPolicyForm({
            warrantyInfo: data.warrantyInfo || "",
            authenticityInfo: data.authenticityInfo || "",
            returnsPolicy: data.returnsPolicy || "",
          });
        } catch {
          setPolicyForm({
            warrantyInfo: "",
            authenticityInfo: "",
            returnsPolicy: "",
          });
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.isAdmin) return;
    loadSection(active);
  }, [active, user]);

  const handleCreateProduct = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(productForm).forEach(([key, value]) => {
        if (value !== "") formData.append(key, value);
      });
      if (productForm.categories) {
        formData.set(
          "categories",
          productForm.categories
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        );
      }
      productImages.forEach((file) => formData.append("images", file));

      const created = await createProduct(formData);
      setProducts((prev) => [created, ...prev]);
      setProductForm({
        name: "",
        brand: "",
        price: "",
        stock: "",
        caseSize: "",
        movement: "",
        strapMaterial: "",
        caseMaterial: "",
        waterResistance: "",
        gender: "",
        categories: "",
        description: "",
      });
      setProductImages([]);
      toast.success("Product created");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Create product failed");
    }
  };

  const handleUpdateProduct = async (event) => {
    event.preventDefault();
    if (!editingProduct) return;
    try {
      const payload = { ...editingProduct };
      if (payload.categories && typeof payload.categories === "string") {
        payload.categories = payload.categories
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
      }
      const updated = await updateProduct(editingProduct._id, payload);
      setProducts((prev) =>
        prev.map((item) => (item._id === updated._id ? updated : item))
      );
      setEditingProduct(null);
      toast.success("Product updated");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Update failed");
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((item) => item._id !== id));
      toast.success("Product deleted");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Delete failed");
    }
  };

  const handleOrderAction = async (action, order) => {
    try {
      let updated;
      if (action === "pay") updated = await markOrderPaid(order._id);
      if (action === "ship") updated = await markOrderShipped(order._id);
      if (action === "deliver") updated = await markOrderDelivered(order._id);
      if (action === "cancel") updated = await cancelOrder(order._id);
      if (action === "refund") {
        const amount = window.prompt("Refund amount (leave empty for full)");
        const reason = window.prompt("Refund reason (optional)");
        updated = await refundOrder(order._id, {
          refundAmount: amount || undefined,
          refundReason: reason || undefined,
        });
      }
      if (updated) {
        setOrders((prev) =>
          prev.map((item) => (item._id === updated._id ? updated : item))
        );
        toast.success("Order updated");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Order action failed");
    }
  };
  const handleCouponFieldChange = (field, value) =>
    setCouponForm((prev) => ({ ...prev, [field]: value }));

  const handleStartEditCoupon = (coupon) => {
    setEditingCoupon(coupon);
    setCouponForm({
      code: coupon.code,
      discountType: coupon.discountType,
      value: coupon.value,
      minOrder: coupon.minOrder || "",
      maxDiscount: coupon.maxDiscount || "",
      expiresAt: coupon.expiresAt?.slice(0, 10) || "",
    });
  };

  const handleCancelEditCoupon = () => {
    setEditingCoupon(null);
    setCouponForm(createEmptyCouponForm());
  };

  const handleDeleteCouponById = async (id) => {
    try {
      await deleteCoupon(id);
      setCoupons((prev) => prev.filter((item) => item._id !== id));
      if (editingCoupon?._id === id) {
        handleCancelEditCoupon();
      }
      toast.success("Coupon deleted");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Delete failed");
    }
  };

  const handleGiftCardFieldChange = (field, value) =>
    setGiftCardForm((prev) => ({ ...prev, [field]: value }));

  const handleCouponSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editingCoupon) {
        const updated = await updateCoupon(editingCoupon._id, couponForm);
        setCoupons((prev) =>
          prev.map((item) => (item._id === updated._id ? updated : item))
        );
        setEditingCoupon(null);
      } else {
        const created = await createCoupon(couponForm);
        setCoupons((prev) => [created, ...prev]);
      }
      setCouponForm(createEmptyCouponForm());
      toast.success("Coupon saved");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Coupon save failed");
    }
  };

  const handleGiftCardSubmit = async (event) => {
    event.preventDefault();
    try {
      const created = await createGiftCard(giftCardForm);
      setGiftCards((prev) => [created, ...prev]);
      setGiftCardForm(createEmptyGiftCardForm());
      toast.success("Gift card created");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Gift card failed");
    }
  };

  const handleRedeemGiftCard = async (code) => {
    const amount = window.prompt("Redeem amount");
    if (!amount) return;
    try {
      const updated = await redeemGiftCard(code, { amount });
      setGiftCards((prev) =>
        prev.map((item) => (item._id === updated._id ? updated : item))
      );
      toast.success("Gift card redeemed");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Redeem failed");
    }
  };

  const handlePolicySave = async () => {
    try {
      await upsertPolicy("store", policyForm);
      toast.success("Policy saved");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Policy save failed");
    }
  };

  const productRows = useMemo(() => products || [], [products]);

  if (!user?.isAdmin) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-10 text-center text-gray-500">
          Admin access only.
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-semibold mb-6">Admin Dashboard</h1>
        <div className="grid lg:grid-cols-[240px_1fr] gap-8">
          <AdminSidebar sections={sections} active={active} onSectionChange={setActive} />


            <section className="space-y-6">
              {loading ? (
                <div className="h-40 bg-gray-100 rounded-2xl animate-pulse" />
              ) : null}

              {active === "products" && (
                <AddProductSection
                  editingProduct={editingProduct}
                  productForm={productForm}
                  setProductForm={setProductForm}
                  productImages={productImages}
                  setProductImages={setProductImages}
                  handleCreateProduct={handleCreateProduct}
                  handleUpdateProduct={handleUpdateProduct}
                  handleDeleteProduct={handleDeleteProduct}
                  setEditingProduct={setEditingProduct}
                  productRows={productRows}
                />
              )}

              {active === "orders" && (
                <OrdersSection orders={orders} onOrderAction={handleOrderAction} />
              )}

              {active === "coupons" && (
                <CouponsSection
                  coupons={coupons}
                  couponForm={couponForm}
                  editingCoupon={editingCoupon}
                  onCouponFieldChange={handleCouponFieldChange}
                  onCouponSubmit={handleCouponSubmit}
                  onStartEditCoupon={handleStartEditCoupon}
                  onCancelEditCoupon={handleCancelEditCoupon}
                  onDeleteCoupon={handleDeleteCouponById}
                />
              )}

              {active === "giftcards" && (
                <GiftCardsSection
                  giftCards={giftCards}
                  giftCardForm={giftCardForm}
                  onGiftCardFieldChange={handleGiftCardFieldChange}
                  onGiftCardSubmit={handleGiftCardSubmit}
                  onRedeemGiftCard={handleRedeemGiftCard}
                />
              )}

              {active === "drops" && <DropsSection />}

              {active === "policies" && (
                <PoliciesSection
                  policyForm={policyForm}
                  onPolicyChange={(field, value) =>
                    setPolicyForm((prev) => ({ ...prev, [field]: value }))
                  }
                  onSavePolicy={handlePolicySave}
                />
              )}
            </section>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
