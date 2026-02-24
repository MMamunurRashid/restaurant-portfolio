const mongoose = require("mongoose");

const academySchema = new mongoose.Schema(
  {
    images: {
      type: String,
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
    instructor: {
      type: String,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
    },
    duration: {
      type: String,
    },
  },
  { timestamps: true }
);

const Academy = mongoose.model("Academy", academySchema);

module.exports = Academy;
