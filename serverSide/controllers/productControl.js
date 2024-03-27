import catchErrors from "../checkmate/catchErrors.js";
import ErrorHandler from "../checkmate/errorHandler.js";
import Product from "../models/product.js";
import FiltersAPI from "../checkmate/filters_API.js"; 
import Order from "../models/order.js"
import { upload_file, delete_file } from "../utility/cloudnary.js";

// create getProducts

export const getProducts = catchErrors(async (req, res, next) => {
  const resPerPage = 4;
  
  const filterAPI = new FiltersAPI(Product, req.query).search().filters();

  // Call pagination method on the filterAPI instance
  filterAPI.pagination(resPerPage);

  let products = await filterAPI.query.clone();

  let filterProducts = products.length;

  res.status(200).json({
    resPerPage,
    filterProducts,
    products,
  });
});

// Create new Product => /api/v1/products
export const newProduct = catchErrors(async (req, res, next) => {
  req.body.user = req.user._id;
  
  const product = await Product.create(req.body);

  res.status(200).json({
    product,
  });
});

// Get single Product details - user => /api/v1/products/:id
export const getProductDetails = catchErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate("reviews.user");

  if (!product) {
    return next(new ErrorHandler("Product not available", 404));
  }

  res.status(200).json({
    product,
  });
});

// Get single Product details - Admin => /api/v1/products/:id
export const getAdminProducts = catchErrors(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    products,
  });
});

// Update Product details => /api/v1/products/:id
export const updateProduct = catchErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not available", 404));
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json({
    product,
  });
});

// upload product images => /api/v1/products/:id
export const uploadProductImages = catchErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not available", 404));
  }

  const uploader = async (image) => upload_file(image, "/Pro_img")

  const urls = await Promise.all(req.body.images.map(uploader));

  product.images.push(...urls);
  await product.save();
  
  res.status(200).json({
    product,
  });
});

// delete product images => /api/v1/products/:id
export const deleteProductImages = catchErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not available", 404));
  }

  const isDeleted = await delete_file(req.body.imgId);

  if (isDeleted) {
    product.images = product.images.filter(img => img.public_id !== req.body.imgId);
    await product.save();
  }
  
  res.status(200).json({
    product,
  });
});

// Delete Product details => /api/v1/products/:id
export const deleteProduct = catchErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not available", 404));
  }

  // deleting image
  for (let i = 0; i < product.images.length; i++) {
    await delete_file(product.images[i].public_id);
  }

  await product.deleteOne();

  res.status(200).json({
    message: "Product removed from cart",
  });
});

// create Product review => /api/v1/products/:id
export const createProductReview = catchErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    rating: Number(rating),
    comment,
  };

  let product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorHandler("Product not available", 404));
  }

  const isReviewed = product.reviews.find(review => review.user.toString() === req.user._id.toString());

  if (isReviewed) {
    product.reviews.forEach(review => {
      if (review.user.toString() === req.user._id.toString()) {
        review.comment = comment;
        review.rating = rating;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// get product reviews
export const getProductReview = catchErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id).populate("reviews.user");

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    reviews: product.reviews,
  });
});

// delete Product review => /api/v1/products/:id
export const deleteReview = catchErrors(async (req, res, next) => {
  let product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler("Product not available", 404));
  }

  product.reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString());

  const numOfReviews = product.reviews.length;
  const ratings = numOfReviews === 0 ? 0 : product.reviews.reduce((acc, item) => item.rating + acc, 0) / numOfReviews;

  product = await Product.findByIdAndUpdate(
    req.query.productId,
    { reviews: product.reviews, numOfReviews, ratings },
    { new: true }
  );

  res.status(200).json({
    success: true,
    product,
  });
});

// check if user can review => /api/v1/products/:id
export const canUserReview = catchErrors(async (req, res, next) => {
  const orders = await Order.find({
    user: req.user._id,
    "orderItems.product": req.query.productId,
  });

  res.status(200).json({
    canReview: orders.length > 0,
  });
});
