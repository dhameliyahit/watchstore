import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

const calculateCartTotals = (cart) => {
  let subtotal = 0;
  let itemCount = 0;

  cart.items.forEach((item) => {
    subtotal += item.price * item.quantity;
    itemCount += item.quantity;
  });

  cart.subtotal = Number(subtotal.toFixed(2));
  cart.itemCount = itemCount;
};

/**
 * @desc Get cart for current user
 * @route GET /api/cart
 * @access Private (JWT)
 */
export const getCart = async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  res.json(cart);
};

/**
 * @desc Add item to cart
 * @route POST /api/cart/items
 * @access Private (JWT)
 */
export const addCartItem = async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const qty = Number(quantity);

  if (!productId || Number.isNaN(qty) || qty < 1) {
    return res
      .status(400)
      .json({ message: "productId and quantity are required" });
  }

  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    return res.status(404).json({ message: "Product not found" });
  }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );

  const newQty = existingItem ? existingItem.quantity + qty : qty;
  if (product.stock < newQty) {
    return res.status(400).json({ message: "Insufficient stock" });
  }

  if (existingItem) {
    existingItem.quantity = newQty;
  } else {
    cart.items.push({
      product: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0],
      quantity: qty,
    });
  }

  calculateCartTotals(cart);
  const updated = await cart.save();

  res.json(updated);
};

/**
 * @desc Update cart item quantity
 * @route PUT /api/cart/items/:productId
 * @access Private (JWT)
 */
export const updateCartItem = async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  const qty = Number(quantity);

  if (!productId || Number.isNaN(qty) || qty < 0) {
    return res
      .status(400)
      .json({ message: "productId and quantity are required" });
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );
  if (itemIndex === -1) {
    return res.status(404).json({ message: "Cart item not found" });
  }

  if (qty === 0) {
    cart.items.splice(itemIndex, 1);
    calculateCartTotals(cart);
    const updated = await cart.save();
    return res.json(updated);
  }

  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    return res.status(404).json({ message: "Product not found" });
  }
  if (product.stock < qty) {
    return res.status(400).json({ message: "Insufficient stock" });
  }

  cart.items[itemIndex].quantity = qty;
  cart.items[itemIndex].price = product.price;
  cart.items[itemIndex].name = product.name;
  cart.items[itemIndex].image = product.images?.[0];

  calculateCartTotals(cart);
  const updated = await cart.save();
  res.json(updated);
};

/**
 * @desc Remove item from cart
 * @route DELETE /api/cart/items/:productId
 * @access Private (JWT)
 */
export const removeCartItem = async (req, res) => {
  const { productId } = req.params;
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );

  calculateCartTotals(cart);
  const updated = await cart.save();
  res.json(updated);
};

/**
 * @desc Clear cart
 * @route DELETE /api/cart
 * @access Private (JWT)
 */
export const clearCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  cart.items = [];
  calculateCartTotals(cart);
  const updated = await cart.save();

  res.json(updated);
};
