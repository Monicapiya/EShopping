import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter the product name"],
    maxLength: [200, "Product name cannot exceed 200 characters"],
  },
  price: {
    type: Number,
    required: [true, "Please enter the product price"],
    max: [9999999, "Product price cannot exceed 7 digits"],
  },
  description: {
    type: String,
    required: [true, "Please enter the product description"],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Please enter the product category"],
    enum: {
      values: [
        "Mobiles",
        "Computers",
        "TV Appliances",
        "Men's Fashion",
        "Women Fashion",
        "Home Kitchen",
        "Beauty Health",
        "Bags Luggage",
      ],
      message: "Please select the correct Category",
    },
  },
  seller: {
    type: String,
    required: [true, "Please enter the product seller"],
  },
  stock: {
    type: Number,
    required: [true, "Please enter product stock"],
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
