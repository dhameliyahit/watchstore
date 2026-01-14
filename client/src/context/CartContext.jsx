import { createContext, useContext, useEffect, useState } from "react";
import { addToCart, clearCart, getCart, removeCartItem, updateCartItem } from "../api/cart";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { token } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshCart = async () => {
    if (!token) {
      setCart(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const data = await getCart();
    setCart(data);
    setLoading(false);
  };

  useEffect(() => {
    refreshCart();
  }, [token]);

  const addItem = async (productId, quantity = 1) => {
    const data = await addToCart({ productId, quantity });
    setCart(data);
    return data;
  };

  const updateItem = async (productId, quantity) => {
    const data = await updateCartItem(productId, { quantity });
    setCart(data);
    return data;
  };

  const removeItem = async (productId) => {
    const data = await removeCartItem(productId);
    setCart(data);
    return data;
  };

  const clear = async () => {
    const data = await clearCart();
    setCart(data);
    return data;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        refreshCart,
        addItem,
        updateItem,
        removeItem,
        clear,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
