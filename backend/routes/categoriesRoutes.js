const router = require("express").Router();
const {
  addCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  addSubCategory,
  addSubSubCategory,
  updateSubCategory,
  updateSubSubCategory,
  deleteSubSubCategory,
  deleteSubCategory,
  getSubCategories,
  getSubCategoryById,
  getSubSubCategories,
  getSubSubCategoryById,
} = require("../controllers/categoriesController");
const singleUploader = require("../utils/singleUploader");
const upload = singleUploader("categories").single("icon");

// Category:
router.post("/addCategory", upload, addCategory);
router.get("/allCategories", getCategories);

// Sub Category:
router.post("/addSubCategory", addSubCategory);
router.get("/allSubCategories", getSubCategories);

// Sub SubCategory:
router.post("/addSubSubCategory", addSubSubCategory);
router.get("/allSubSubCategories", getSubSubCategories);

// Category:
router.get("/category/:id", getCategory);
router.patch("/updateCategory/:id", upload, updateCategory);
router.delete("/deleteCategory/:id", deleteCategory);

// Sub Category:
router.get("/subCategory/:id", getSubCategoryById);
router.patch("/updateSubCategory/:id", updateSubCategory);
router.delete("/deleteSubCategory/:id", deleteSubCategory);

// Sub Sub Category:
router.get("/subSubCategory/:id", getSubSubCategoryById);
router.patch("/updateSubSubCategory/:id", updateSubSubCategory);
router.delete("/deleteSubSubCategory/:id", deleteSubSubCategory);

module.exports = router;
