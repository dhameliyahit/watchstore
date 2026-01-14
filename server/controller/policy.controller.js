import Policy from "../models/policy.model.js";

/**
 * @desc Get policy by key
 * @route GET /api/policies/:key
 * @access Public
 */
export const getPolicyByKey = async (req, res) => {
  const policy = await Policy.findOne({ key: req.params.key });
  if (!policy) {
    return res.status(404).json({ message: "Policy not found" });
  }
  res.json(policy);
};

/**
 * @desc Upsert policy (admin)
 * @route PUT /api/policies/:key
 * @access Private (JWT + Admin)
 */
export const upsertPolicy = async (req, res) => {
  const { key } = req.params;
  const { warrantyInfo, authenticityInfo, returnsPolicy } = req.body;

  const policy = await Policy.findOneAndUpdate(
    { key },
    { key, warrantyInfo, authenticityInfo, returnsPolicy },
    { upsert: true, new: true }
  );

  res.json(policy);
};
