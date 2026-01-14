import Cart from "../models/cart.model.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

const getDefaultAddress = (user) => ({
  firstName: user.firstName,
  lastName: user.lastName,
  streetAddr: user.streetAddr,
  city: user.city,
  state: user.state,
  postalCode: user.postalCode,
  country: user.country,
});

const calculateItemsPrice = (items) =>
  Number(
    items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)
  );

/**
 * @desc Create order from cart (checkout)
 * @route POST /api/checkout
 * @access Private (JWT)
 */
export const createOrderFromCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  const shippingAddress = {
    ...getDefaultAddress(req.user),
    ...(req.body.shippingAddress || {}),
  };

  if (
    !shippingAddress.streetAddr ||
    !shippingAddress.city ||
    !shippingAddress.postalCode ||
    !shippingAddress.country ||
    !shippingAddress.phone
  ) {
    return res.status(400).json({ message: "Shipping address is required" });
  }

  for (const item of cart.items) {
    const product = await Product.findById(item.product);
    if (!product || !product.isActive) {
      return res.status(400).json({ message: "Product not available" });
    }
    if (product.stock < item.quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }
  }

  for (const item of cart.items) {
    const product = await Product.findById(item.product);
    product.stock -= item.quantity;
    await product.save();
  }

  const itemsPrice = calculateItemsPrice(cart.items);
  const shippingPriceRaw = Number(req.body.shippingPrice || 0);
  const taxPriceRaw = Number(req.body.taxPrice || 0);
  const shippingPrice = Number.isNaN(shippingPriceRaw) ? 0 : shippingPriceRaw;
  const taxPrice = Number.isNaN(taxPriceRaw) ? 0 : taxPriceRaw;
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

  const order = await Order.create({
    user: req.user._id,
    items: cart.items,
    shippingAddress,
    paymentMethod: req.body.paymentMethod || "manual",
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  });

  cart.items = [];
  cart.subtotal = 0;
  cart.itemCount = 0;
  await cart.save();

  res.status(201).json(order);
};

/**
 * @desc Get logged-in user's orders
 * @route GET /api/orders/my
 * @access Private (JWT)
 */
export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({
    createdAt: -1,
  });
  res.json(orders);
};

/**
 * @desc Get order by id (owner or admin)
 * @route GET /api/orders/:id
 * @access Private (JWT)
 */
export const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (!req.user.isAdmin && order.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }

  res.json(order);
};

/**
 * @desc Get all orders (admin)
 * @route GET /api/orders
 * @access Private (JWT + Admin)
 */
export const getAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate("user", "email firstName lastName")
    .sort({ createdAt: -1 });
  res.json(orders);
};

/**
 * @desc Mark order as paid (admin)
 * @route PUT /api/orders/:id/pay
 * @access Private (JWT + Admin)
 */
export const markOrderPaid = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.isPaid = true;
  order.paidAt = new Date();
  if (order.status === "pending") {
    order.status = "paid";
  }

  const updated = await order.save();
  res.json(updated);
};

/**
 * @desc Mark order as shipped (admin)
 * @route PUT /api/orders/:id/ship
 * @access Private (JWT + Admin)
 */
export const markOrderShipped = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.status = "shipped";
  const updated = await order.save();
  res.json(updated);
};

/**
 * @desc Mark order as delivered (admin)
 * @route PUT /api/orders/:id/deliver
 * @access Private (JWT + Admin)
 */
export const markOrderDelivered = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.isDelivered = true;
  order.deliveredAt = new Date();
  order.status = "delivered";

  const updated = await order.save();
  res.json(updated);
};

/**
 * @desc Cancel order (admin)
 * @route PUT /api/orders/:id/cancel
 * @access Private (JWT + Admin)
 */
export const cancelOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (order.status === "delivered") {
    return res.status(400).json({ message: "Delivered orders cannot be cancelled" });
  }

  order.status = "cancelled";
  const updated = await order.save();
  res.json(updated);
};

/**
 * @desc Refund order (admin)
 * @route PUT /api/orders/:id/refund
 * @access Private (JWT + Admin)
 */
export const refundOrder = async (req, res) => {
  const { refundAmount, refundReason } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (order.isRefunded) {
    return res.status(400).json({ message: "Order already refunded" });
  }

  const amount =
    refundAmount === undefined ? order.totalPrice : Number(refundAmount);
  if (Number.isNaN(amount) || amount < 0) {
    return res.status(400).json({ message: "Invalid refund amount" });
  }

  order.isRefunded = true;
  order.refundedAt = new Date();
  order.refundAmount = amount;
  order.refundReason = refundReason;
  order.status = "refunded";

  const updated = await order.save();
  res.json(updated);
};
