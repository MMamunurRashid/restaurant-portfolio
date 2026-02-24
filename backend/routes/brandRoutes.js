const router = require("express").Router();
const verifyAdmin = require("../middleware/verifyAdmin");
const {
  addBrand,
  allBrands,
  deleteBrand,
  getBrandById,
  editBrand,
} = require("../controllers/brandControllers");
const singleUploader = require("../utils/singleUploader");
const upload = singleUploader("brands").single("icon");

router.post("/add", verifyAdmin, upload, addBrand);
router.get("/allBrands", allBrands);
router.get("/single/:id", getBrandById);
router.patch("/edit/:id", verifyAdmin, upload, editBrand);
router.delete("/delete/:id", verifyAdmin, deleteBrand);

module.exports = router;
