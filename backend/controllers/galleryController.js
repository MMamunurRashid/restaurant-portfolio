const fs = require("fs");
const Gallery = require("../models/galleryModel");

exports.add = async (req, res) => {
  const image = req?.file?.filename;

  try {
    let result = await Gallery.create({ image });

    res.status(201).json({
      success: true,
      message: "Gallery created successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });

    if (image) {
      fs.unlink(`./uploads/gallery/${image}`, (err) => {
        if (err) {
          console.error(err);
        }
      });
    }
  }
};

exports.get = async (req, res) => {
  try {
    const result = await Gallery.find({});

    if (!result) {
      return res.status(404).json({
        success: false,
        error: "Gallery not found",
      });
    }

    const midIndex = Math.ceil(result.length / 2);
    const firstSlide = result.slice(0, midIndex);
    const secondSlide = result.slice(midIndex);

    res.status(200).json({
      success: true,
      message: "Gallery fetched successfully",
      data: { result, firstSlide, secondSlide },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

exports.getSingle = async (req, res) => {
  try {
    let { id } = req.params;
    const result = await Gallery.findById(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        error: "Gallery not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Gallery Fetch Successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

exports.destroy = async (req, res) => {
  const id = req?.params?.id;

  try {
    const isExist = await Gallery.findById(id);

    if (!isExist) {
      return res.status(404).json({
        success: false,
        error: "Gallery not found",
      });
    }

    const result = await Gallery.findByIdAndDelete(id);
    if (result?._id) {
      fs.unlink(`./uploads/gallery/${isExist?.image}`, (err) => {
        if (err) {
          console.error(err);
        }
      });
    }

    res.status(200).json({
      success: true,
      message: "Gallery delete successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
