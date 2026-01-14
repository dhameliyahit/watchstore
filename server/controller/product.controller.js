import Product from "../models/product.model.js";
import { deleteImageFromGithub, extractFilename, uploadImageToGithub } from "../utils/githubUpload.js";

const parseList = (value) =>
  value
    ? value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

const parseBool = (value) =>
  value === undefined ? undefined : value === "true";

/**
 * @desc Create product (admin)
 * @route POST /api/products
 * @access Private (JWT + Admin)
 */
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      collection,
      sku,
      description,
      price,
      currency,
      images,
      stock,
      caseSize,
      caseMaterial,
      strapMaterial,
      movement,
      waterResistance,
      gender,
      categories,
      isActive,
    } = req.body;

    if (!name || !brand || price === undefined) {
      return res.status(400).json({
        message: "name, brand, and price are required",
      });
    }

    let parsedCaseSize;
    if (caseSize !== undefined && caseSize !== null) {
      parsedCaseSize = Number(String(caseSize).replace(/[^0-9.]/g, ""));

      if (isNaN(parsedCaseSize)) {
        return res.status(400).json({
          message: "caseSize must be a number (example: 40)",
        });
      }
    }

    const files = req.files || [];
    const uploadedUrls = [];

    for (const file of files) {
      const result = await uploadImageToGithub({
        buffer: file.buffer,
        originalName: file.originalname,
        mimeType: file.mimetype,
      });

      uploadedUrls.push(result.url);
    }

    const product = await Product.create({
      name,
      brand,
      collection,
      sku,
      description,
      price,
      currency,
      images: uploadedUrls.length ? uploadedUrls : images,
      stock: Number(stock) || 0,
      caseSize: parsedCaseSize,
      caseMaterial,
      strapMaterial,
      movement,
      waterResistance,
      gender,
      categories,
      isActive,
    });

    return res.status(201).json(product);
  } catch (error) {
    console.error("Create product error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.errors,
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

/**
 * @desc Get all products with filters/search
 * @route GET /api/products
 * @access Public
 */
export const getProducts = async (req, res) => {
  const {
    search,
    brand,
    brands,
    minPrice,
    maxPrice,
    minCaseSize,
    maxCaseSize,
    movement,
    strapMaterial,
    caseMaterial,
    waterResistance,
    gender,
    category,
    inStock,
    isActive,
    sort,
    page = 1,
    limit = 12,
  } = req.query;

  const filter = {};

  const brandList = parseList(brand || brands);
  if (brandList.length) {
    filter.brand = { $in: brandList };
  }

  const categoryList = parseList(category);
  if (categoryList.length) {
    filter.categories = { $in: categoryList };
  }

  const movementList = parseList(movement);
  if (movementList.length) {
    filter.movement = { $in: movementList };
  }

  const strapList = parseList(strapMaterial);
  if (strapList.length) {
    filter.strapMaterial = { $in: strapList };
  }

  const caseMaterialList = parseList(caseMaterial);
  if (caseMaterialList.length) {
    filter.caseMaterial = { $in: caseMaterialList };
  }

  const waterList = parseList(waterResistance);
  if (waterList.length) {
    filter.waterResistance = { $in: waterList };
  }

  const genderList = parseList(gender);
  if (genderList.length) {
    filter.gender = { $in: genderList };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) {
      filter.price.$gte = Number(minPrice);
    }
    if (maxPrice !== undefined) {
      filter.price.$lte = Number(maxPrice);
    }
  }

  if (minCaseSize !== undefined || maxCaseSize !== undefined) {
    filter.caseSize = {};
    if (minCaseSize !== undefined) {
      filter.caseSize.$gte = Number(minCaseSize);
    }
    if (maxCaseSize !== undefined) {
      filter.caseSize.$lte = Number(maxCaseSize);
    }
  }

  const inStockBool = parseBool(inStock);
  if (inStockBool === true) {
    filter.stock = { $gt: 0 };
  }

  const isActiveBool = parseBool(isActive);
  filter.isActive = isActiveBool === undefined ? true : isActiveBool;

  if (search) {
    filter.$text = { $search: search };
  }

  const sortMap = {
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    name_asc: { name: 1 },
    name_desc: { name: -1 },
  };
  const sortBy = sortMap[sort] || sortMap.newest;

  const pageNumber = Math.max(Number(page) || 1, 1);
  const pageSize = Math.max(Number(limit) || 12, 1);

  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .sort(sortBy)
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize);

  res.json({
    items: products,
    page: pageNumber,
    pages: Math.ceil(total / pageSize),
    total,
  });
};

/**
 * @desc Get product by id
 * @route GET /api/products/:id
 * @access Public
 */
export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
};

/**
 * @desc Update product (admin)
 * @route PUT /api/products/:id
 * @access Private (JWT + Admin)
 */
export const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  product.name = req.body.name ?? product.name;
  product.brand = req.body.brand ?? product.brand;
  product.collection = req.body.collection ?? product.collection;
  product.sku = req.body.sku ?? product.sku;
  product.description = req.body.description ?? product.description;
  product.price = req.body.price ?? product.price;
  product.currency = req.body.currency ?? product.currency;
  product.images = req.body.images ?? product.images;
  product.stock = req.body.stock ?? product.stock;
  product.caseSize = req.body.caseSize ?? product.caseSize;
  product.caseMaterial = req.body.caseMaterial ?? product.caseMaterial;
  product.strapMaterial = req.body.strapMaterial ?? product.strapMaterial;
  product.movement = req.body.movement ?? product.movement;
  product.waterResistance = req.body.waterResistance ?? product.waterResistance;
  product.gender = req.body.gender ?? product.gender;
  product.categories = req.body.categories ?? product.categories;
  product.isActive = req.body.isActive ?? product.isActive;

  const updatedProduct = await product.save();
  res.json(updatedProduct);
};

/**
 * @desc Delete product (admin)
 * @route DELETE /api/products/:id
 * @access Private (JWT + Admin)
 */
export const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  if (Array.isArray(product.images)) {
    for (const imageUrl of product.images) {
      try {
        const filename = extractFilename(imageUrl);
        await deleteImageFromGithub(filename);
      } catch (imgErr) {
        console.error("Image delete failed:", imgErr.message);
        // continue deleting product even if image delete fails
      }
    }
  }

  await product.deleteOne();
  res.json({ message: "Product deleted successfully" });
};

/**
 * @desc Adjust product stock (admin)
 * @route PATCH /api/products/:id/stock
 * @access Private (JWT + Admin)
 */
export const adjustProductStock = async (req, res) => {
  const { amount, stock } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  if (stock !== undefined) {
    const parsedStock = Number(stock);
    if (Number.isNaN(parsedStock) || parsedStock < 0) {
      return res.status(400).json({ message: "Invalid stock value" });
    }
    product.stock = parsedStock;
  } else if (amount !== undefined) {
    const parsedAmount = Number(amount);
    if (Number.isNaN(parsedAmount)) {
      return res.status(400).json({ message: "Invalid amount value" });
    }
    const nextStock = product.stock + parsedAmount;
    if (nextStock < 0) {
      return res.status(400).json({ message: "Stock cannot be negative" });
    }
    product.stock = nextStock;
  } else {
    return res.status(400).json({ message: "Provide stock or amount" });
  }

  const updated = await product.save();
  res.json(updated);
};

/**
 * @desc Get filter values
 * @route GET /api/products/filters
 * @access Public
 */
export const getProductFilters = async (req, res) => {
  const isActiveBool = parseBool(req.query.isActive);
  const baseFilter =
    isActiveBool === undefined
      ? { isActive: true }
      : { isActive: isActiveBool };

  const [brands, collections, movements, strapMaterials, caseMaterials] =
    await Promise.all([
      Product.distinct("brand", baseFilter),
      Product.distinct("collection", baseFilter),
      Product.distinct("movement", baseFilter),
      Product.distinct("strapMaterial", baseFilter),
      Product.distinct("caseMaterial", baseFilter),
    ]);

  res.json({
    brands: brands.filter(Boolean).sort(),
    collections: collections.filter(Boolean).sort(),
    movements: movements.filter(Boolean).sort(),
    strapMaterials: strapMaterials.filter(Boolean).sort(),
    caseMaterials: caseMaterials.filter(Boolean).sort(),
  });
};

/**
 * @desc Get all brands
 * @route GET /api/products/brands
 * @access Public
 */
export const getAllBrands = async (req, res) => {
  const isActiveBool = parseBool(req.query.isActive);
  const filter =
    isActiveBool === undefined
      ? { isActive: true }
      : { isActive: isActiveBool };

  const brands = await Product.distinct("brand", filter);
  res.json(brands.filter(Boolean).sort());
};

/**
 * @desc Upload product image to GitHub and store URL
 * @route POST /api/products/:id/image
 * @access Private (JWT + Admin)
 */
export const uploadProductImage = async (req, res) => {
  const files = req.files || [];
  if (!files.length) {
    return res.status(400).json({ message: "Image files are required" });
  }

  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const uploads = await Promise.all(
    files.map((file) =>
      uploadImageToGithub({
        buffer: file.buffer,
        originalName: file.originalname,
        mimeType: file.mimetype,
      })
    )
  );

  const urls = uploads.map((item) => item.url);
  product.images = Array.isArray(product.images)
    ? [...product.images, ...urls]
    : [...urls];
  const updated = await product.save();

  res.json({ urls, product: updated });
};
