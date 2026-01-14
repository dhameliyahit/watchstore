import FeaturedDrop from "../models/featureddrop.model.js";

/**
 * @desc Get active featured drops
 * @route GET /api/featured-drops
 * @access Public
 */
export const getFeaturedDrops = async (req, res) => {
  const now = new Date();
  const drops = await FeaturedDrop.find({
    isActive: true,
    $and: [
      { $or: [{ startsAt: null }, { startsAt: { $lte: now } }] },
      { $or: [{ endsAt: null }, { endsAt: { $gte: now } }] },
    ],
  }).populate("products");
  res.json(drops);
};

/**
 * @desc Create featured drop (admin)
 * @route POST /api/featured-drops
 * @access Private (JWT + Admin)
 */
export const createFeaturedDrop = async (req, res) => {
  const { title, description, products, startsAt, endsAt, isActive } = req.body;
  if (!title) {
    return res.status(400).json({ message: "title is required" });
  }

  const drop = await FeaturedDrop.create({
    title,
    description,
    products,
    startsAt,
    endsAt,
    isActive,
  });

  res.status(201).json(drop);
};

/**
 * @desc Update featured drop (admin)
 * @route PUT /api/featured-drops/:id
 * @access Private (JWT + Admin)
 */
export const updateFeaturedDrop = async (req, res) => {
  const drop = await FeaturedDrop.findById(req.params.id);
  if (!drop) {
    return res.status(404).json({ message: "Featured drop not found" });
  }

  drop.title = req.body.title ?? drop.title;
  drop.description = req.body.description ?? drop.description;
  drop.products = req.body.products ?? drop.products;
  drop.startsAt = req.body.startsAt ?? drop.startsAt;
  drop.endsAt = req.body.endsAt ?? drop.endsAt;
  drop.isActive = req.body.isActive ?? drop.isActive;

  const updated = await drop.save();
  res.json(updated);
};

/**
 * @desc Delete featured drop (admin)
 * @route DELETE /api/featured-drops/:id
 * @access Private (JWT + Admin)
 */
export const deleteFeaturedDrop = async (req, res) => {
  const drop = await FeaturedDrop.findById(req.params.id);
  if (!drop) {
    return res.status(404).json({ message: "Featured drop not found" });
  }

  await drop.deleteOne();
  res.json({ message: "Featured drop deleted successfully" });
};
