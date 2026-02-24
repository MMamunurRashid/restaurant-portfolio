const Academy = require("../models/academyModel");
const slugify = require("slugify");
const fs = require("fs");
const path = require("path");

// Utility function to delete images
const unlinkImage = (imagePath) => {
  const fullPath = path.join(__dirname, "../../uploads/academies", imagePath);
  fs.unlink(fullPath, (err) => {
    if (err) {
      console.error(`Error deleting file ${fullPath}:`, err);
    }
  });
};

// 1. Create a new Academy
exports.createAcademy = async (req, res) => {
  const image = req.file ? req.file.filename : null;
  if (!image) {
    return res.status(400).json({ success: false, error: "Image is required" });
  }

  const { title, instructor, discount, description, location, price, duration } = req.body;

  const academyData = {
    ...req.body,
    slug: slugify(`${title}-${Date.now()}`),
    images: image,
  };

  try {
    const academy = await Academy.create(academyData);
    res.status(201).json({
      success: true,
      message: "Academy created successfully",
      data: academy,
    });
  } catch (error) {
    if (image) unlinkImage(image);
    res.status(500).json({ success: false, error: error.message });
  }
};

// 2. Get all Academies
exports.getAllAcademies = async (req, res) => {
  try {
    const academies = await Academy.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Academies fetched successfully",
      data: academies,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 3. Get Academy by Slug
exports.getAcademyBySlug = async (req, res) => {
  console.log("Slug:", req.params.slug);
  try {
    const academy = await Academy.findOne({ slug: req.params.slug });
    if (!academy) {
      return res.status(404).json({
        success: false,
        message: "Academy not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Academy fetched successfully",
      data: academy,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 4. Get Academy by ID
exports.getAcademyById = async (req, res) => {
  try {
    const academy = await Academy.findById(req.params.id);
    if (!academy) {
      return res.status(404).json({
        success: false,
        message: "Academy not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Academy fetched successfully",
      data: academy,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 5. Update Academy
exports.updateAcademy = async (req, res) => {
  const { id } = req.params;
  const image = req.file ? req.file.filename : null;

  try {
    const academy = await Academy.findById(id);
    if (!academy) {
      if (image) unlinkImage(image); // Clean up uploaded image if not used
      return res.status(404).json({ success: false, message: "Academy not found" });
    }

    // Delete the old image if a new one is provided
    if (image && academy.images) {
      unlinkImage(academy.images);
    }

    const updatedData = {
      ...req.body,
      images: image || academy.images,
    };

    const updatedAcademy = await Academy.findByIdAndUpdate(id, updatedData, { new: true });
    res.status(200).json({
      success: true,
      message: "Academy updated successfully",
      data: updatedAcademy,
    });
  } catch (error) {
    if (image) unlinkImage(image);
    res.status(500).json({ success: false, error: error.message });
  }
};

// 6. Delete Academy
exports.deleteAcademy = async (req, res) => {
  try {
    const academy = await Academy.findById(req.params.id);
    if (!academy) {
      return res.status(404).json({ success: false, message: "Academy not found" });
    }

    // Delete associated image
    if (academy.images) unlinkImage(academy.images);

    await Academy.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "Academy deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
