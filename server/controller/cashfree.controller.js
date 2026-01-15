import crypto from "crypto";
import "dotenv/config";
import Order from "../models/order.model.js";

const getConfig = () => ({
  appId: process.env.CASHFREE_APP_ID,
  secret: process.env.CASHFREE_SECRET,
  sandbox: process.env.CASHFREE_ENV !== "prod",
  returnUrl:
    process.env.CASHFREE_RETURN_URL || "http://heet.qzz.io/payment/success",
});

const getBaseUrl = (sandbox) =>
  sandbox ? "https://sandbox.cashfree.com" : "https://api.cashfree.com";

const createSignature = (data, secret) =>
  crypto.createHmac("sha256", secret).update(data).digest("hex");

export const initiateCashfreePayment = async (req, res) => {
  const { orderId } = req.body;
  if (!orderId) {
    return res.status(400).json({ message: "orderId is required" });
  }

  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (!req.user.isAdmin && order.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }

  const config = getConfig();
  if (!config.appId || !config.secret) {
    return res.status(500).json({ message: "Cashfree config missing" });
  }

  const customerPhone =
    req.body.customerPhone ||
    order.shippingAddress?.phone ||
    order.user?.phone ||
    "";

  if (!customerPhone) {
    return res
      .status(400)
      .json({ message: "Customer phone is required for Cashfree" });
  }

  const payload = {
    order_id: order._id.toString(),
    order_amount: order.totalPrice.toFixed(2),
    order_currency: "INR",
    customer_details: {
      customer_id: order.user.toString(),
      customer_email: req.user.email,
      customer_phone: customerPhone.replace(/\D/g, ""),
    },
    order_meta: {
      return_url: config.returnUrl,
    },
  };

  const response = await fetch(`${getBaseUrl(config.sandbox)}/pg/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-client-id": config.appId,
      "x-client-secret": config.secret,
      "x-api-version": process.env.CASHFREE_API_VERSION || "2022-01-01",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errData = await response.text();
    return res
      .status(502)
      .json({ message: "Cashfree initiation failed", details: errData });
  }

  const data = await response.json();
  order.paymentResult = {
    provider: "cashfree",
    orderId: order._id.toString(),
    raw: data,
  };
  await order.save();

  res.json({
    orderId: payload.order_id,
    paymentLink: data.payment_link,
    cfOrderId: data.order_id,
  });
};

export const cashfreeCallback = async (req, res) => {
  const config = getConfig();
  const {
    orderId,
    orderAmount,
    referenceId,
    txStatus,
    paymentMode,
    txMsg,
    txTime,
    signature,
  } = req.body;

  const dataString = `${orderId}${orderAmount}${referenceId}${txStatus}`;
  const expectedSignature = createSignature(dataString, config.secret);

  if (expectedSignature !== signature) {
    return res.status(400).json({ message: "Invalid signature" });
  }

  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.paymentResult = {
    provider: "cashfree",
    orderId,
    txnId: referenceId,
    status: txStatus,
    gateway: paymentMode,
    respMsg: txMsg,
    raw: req.body,
  };

  if (txStatus === "SUCCESS") {
    order.isPaid = true;
    order.paidAt = new Date();
    order.status = "paid";
  }

  await order.save();
  res.json({ received: true });
};
