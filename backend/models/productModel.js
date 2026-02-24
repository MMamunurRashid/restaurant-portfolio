const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    images: {
      type: Array,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Categories",
    },
    discount: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      required: true,
    },
    sellingPrice: {
      type: Number,
    },
    duration: {
      type: String,
    },
    rating: {
      type: Number,
      default: 0,
    },
    reviewer: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
