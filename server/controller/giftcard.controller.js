import GiftCard from "../models/giftcard.model.js";

const normalizeCode = (code) => (code || "").toUpperCase().trim();

/**
 * @desc Create gift card (admin)
 * @route POST /api/giftcards
 * @access Private (JWT + Admin)
 */
export const createGiftCard = async (req, res) => {
  const { code, initialBalance, expiresAt, isActive } = req.body;

  if (!code || initialBalance === undefined) {
    return res
      .status(400)
      .json({ message: "code and initialBalance are required" });
  }

  const giftCard = await GiftCard.create({
    code: normalizeCode(code),
    initialBalance,
    balance: initialBalance,
    expiresAt,
    isActive,
  });

  res.status(201).json(giftCard);
};

/**
 * @desc List gift cards (admin)
 * @route GET /api/giftcards
 * @access Private (JWT + Admin)
 */
export const getGiftCards = async (req, res) => {
  const giftCards = await GiftCard.find().sort({ createdAt: -1 });
  res.json(giftCards);
};

/**
 * @desc Validate gift card (public)
 * @route GET /api/giftcards/:code
 * @access Public
 */
export const getGiftCardByCode = async (req, res) => {
  const code = normalizeCode(req.params.code);
  const giftCard = await GiftCard.findOne({ code, isActive: true });

  if (!giftCard) {
    return res.status(404).json({ message: "Gift card not found" });
  }

  if (giftCard.expiresAt && giftCard.expiresAt < new Date()) {
    return res.status(400).json({ message: "Gift card expired" });
  }

  res.json(giftCard);
};

/**
 * @desc Redeem gift card amount (admin or trusted service)
 * @route POST /api/giftcards/:code/redeem
 * @access Private (JWT + Admin)
 */
export const redeemGiftCard = async (req, res) => {
  const code = normalizeCode(req.params.code);
  const { amount } = req.body;
  const value = Number(amount);

  if (Number.isNaN(value) || value <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  const giftCard = await GiftCard.findOne({ code, isActive: true });
  if (!giftCard) {
    return res.status(404).json({ message: "Gift card not found" });
  }

  if (giftCard.expiresAt && giftCard.expiresAt < new Date()) {
    return res.status(400).json({ message: "Gift card expired" });
  }

  if (giftCard.balance < value) {
    return res.status(400).json({ message: "Insufficient gift card balance" });
  }

  giftCard.balance = Number((giftCard.balance - value).toFixed(2));
  const updated = await giftCard.save();

  res.json(updated);
};
