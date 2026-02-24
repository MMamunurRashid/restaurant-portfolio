const router = require("express").Router();
const {
  addProduct,
  getAllProducts,
  getProductById,
  getProductBySlug,
  deleteProductById,
  updateProduct,
  getFeaturedProducts,
} = require("../controllers/productController");
const singleUploader = require("../utils/singleUploader");
const upload = singleUploader("products").array("images", 5);

router.post("/add-product", upload, addProduct);
router.get("/all-products", getAllProducts);
router.get("/featured-products", getFeaturedProducts);

router.get("/:id", getProductById);
router.get("/getbyslug/:slug", getProductBySlug);
router.patch("/update-product/:id", upload, updateProduct);
router.delete("/delete/:id", deleteProductById);

module.exports = router;
