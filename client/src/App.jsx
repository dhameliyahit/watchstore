import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import Account from "./pages/Account";
import ShopPage from "./pages/ShopPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import WishlistPage from "./pages/WishlistPage";
import PoliciesPage from "./pages/PoliciesPage";
import DropsPage from "./pages/DropsPage";
import CashfreeSuccess from "./pages/CashfreeSuccess";
import "react-quill/dist/quill.snow.css";

const App = () => {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/account" element={<Account />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/policies" element={<PoliciesPage />} />
        <Route path="/drops" element={<DropsPage />} />
        <Route path="/payment/success" element={<CashfreeSuccess />} />
      </Routes>
    </>
  );
};

export default App;
