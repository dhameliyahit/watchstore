import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

const buildAuthResponse = (user) => ({
  _id: user._id,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  isAdmin: user.isAdmin,
  streetAddr: user.streetAddr,
  city: user.city,
  state: user.state,
  postalCode: user.postalCode,
  country: user.country,
  token: generateToken(user._id, user.isAdmin),
});

const buildProfileResponse = (user) => ({
  _id: user._id,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  isAdmin: user.isAdmin,
  streetAddr: user.streetAddr,
  city: user.city,
  state: user.state,
  postalCode: user.postalCode,
  country: user.country,
});

/**
 * @desc Register user
 * @route POST /api/users/register
 * @access Public
 */
export const registerUser = async (req, res) => {
  const {
    email,
    password,
    firstName,
    lastName,
    streetAddr,
    city,
    state,
    postalCode,
    country,
  } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    password: hashedPassword,
    firstName,
    lastName,
    streetAddr,
    city,
    state,
    postalCode,
    country,
  });

  res.status(201).json(buildAuthResponse(user));
};

/**
 * @desc Login user
 * @route POST /api/users/login
 * @access Public
 */
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json(buildAuthResponse(user));
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};

/**
 * @desc Get logged-in user profile
 * @route GET /api/users/profile
 * @access Private (JWT)
 */
export const getUserProfile = async (req, res) => {
  res.json(buildProfileResponse(req.user));
};

/**
 * @desc Update logged-in user profile
 * @route PUT /api/users/profile
 * @access Private (JWT)
 */
export const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (req.body.email && req.body.email !== user.email) {
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already in use" });
    }
    user.email = req.body.email;
  }
  user.firstName = req.body.firstName || user.firstName;
  user.lastName = req.body.lastName || user.lastName;
  user.streetAddr = req.body.streetAddr || user.streetAddr;
  user.city = req.body.city || user.city;
  user.state = req.body.state || user.state;
  user.postalCode = req.body.postalCode || user.postalCode;
  user.country = req.body.country || user.country;

  if (req.body.password) {
    user.password = await bcrypt.hash(req.body.password, 10);
  }

  const updatedUser = await user.save();

  res.json(buildProfileResponse(updatedUser));
};

/**
 * @desc Get all users (admin)
 * @route GET /api/users
 * @access Private (JWT + Admin)
 */
export const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

/**
 * @desc Delete logged-in user account
 * @route DELETE /api/users/profile
 * @access Private (JWT)
 */
export const deleteUserAccount = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  await user.deleteOne();
  res.json({ message: "Account deleted successfully" });
};

/**
 * @desc Change user role (admin)
 * @route PUT /api/users/:id/role
 * @access Private (JWT + Admin)
 */
export const changeUserRole = async (req, res) => {
  const { id } = req.params;
  const { isAdmin } = req.body;

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (typeof isAdmin !== "boolean") {
    return res.status(400).json({ message: "isAdmin must be boolean" });
  }

  user.isAdmin = isAdmin;
  const updatedUser = await user.save();

  res.json(buildProfileResponse(updatedUser));
};
