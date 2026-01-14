import Coupon from "../models/coupon.model.js";

const normalizeCode = (code) => (code || "").toUpperCase().trim();

/**
 * @desc Create coupon (admin)
 * @route POST /api/coupons
 * @access Private (JWT + Admin)
 */
export const createCoupon = async (req, res) => {
  const { code, discountType, value, minOrder, maxDiscount, expiresAt } =
    req.body;

  if (!code || !discountType || value === undefined) {
    return res
      .status(400)
      .json({ message: "code, discountType, and value are required" });
  }

  const coupon = await Coupon.create({
    code: normalizeCode(code),
    discountType,
    value,
    minOrder,
    maxDiscount,
    expiresAt,
  });

  res.status(201).json(coupon);
};

/**
 * @desc List coupons (admin)
 * @route GET /api/coupons
 * @access Private (JWT + Admin)
 */
export const getCoupons = async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.json(coupons);
};

/**
 * @desc Update coupon (admin)
 * @route PUT /api/coupons/:id
 * @access Private (JWT + Admin)
 */
export const updateCoupon = async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    return res.status(404).json({ message: "Coupon not found" });
  }

  coupon.code = req.body.code ? normalizeCode(req.body.code) : coupon.code;
  coupon.discountType = req.body.discountType ?? coupon.discountType;
  coupon.value = req.body.value ?? coupon.value;
  coupon.minOrder = req.body.minOrder ?? coupon.minOrder;
  coupon.maxDiscount = req.body.maxDiscount ?? coupon.maxDiscount;
  coupon.expiresAt = req.body.expiresAt ?? coupon.expiresAt;
  coupon.isActive = req.body.isActive ?? coupon.isActive;

  const updated = await coupon.save();
  res.json(updated);
};

/**
 * @desc Delete coupon (admin)
 * @route DELETE /api/coupons/:id
 * @access Private (JWT + Admin)
 */
export const deleteCoupon = async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    return res.status(404).json({ message: "Coupon not found" });
  }

  await coupon.deleteOne();
  res.json({ message: "Coupon deleted successfully" });
};

/**
 * @desc Validate coupon (public)
 * @route POST /api/coupons/validate
 * @access Public
 */
export const validateCoupon = async (req, res) => {
  const { code, orderAmount } = req.body;
  const amount = Number(orderAmount || 0);

  const coupon = await Coupon.findOne({
    code: normalizeCode(code),
    isActive: true,
  });

  if (!coupon) {
    return res.status(404).json({ message: "Coupon not found" });
  }

  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return res.status(400).json({ message: "Coupon expired" });
  }

  if (amount < coupon.minOrder) {
    return res.status(400).json({ message: "Order amount is too low" });
  }

  let discount = 0;
  if (coupon.discountType === "percent") {
    discount = (amount * coupon.value) / 100;
  } else {
    discount = coupon.value;
  }

  if (coupon.maxDiscount !== undefined && coupon.maxDiscount !== null) {
    discount = Math.min(discount, coupon.maxDiscount);
  }

  discount = Number(discount.toFixed(2));

  res.json({
    valid: true,
    discount,
    code: coupon.code,
    discountType: coupon.discountType,
    value: coupon.value,
  });
};
