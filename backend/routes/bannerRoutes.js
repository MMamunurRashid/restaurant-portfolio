const router = require("express").Router();
const verifyAdmin = require("../middleware/verifyAdmin");
const {
  addBanner,
  allBanners,
  deleteBanner,
  getBannerById,
  updateBanner,
} = require("../controllers/bannerController");
const singleUploader = require("../utils/singleUploader");
const upload = singleUploader("banner").single("image");

router.post("/add-banner", verifyAdmin, upload, addBanner);
router.get("/all-banners", allBanners);
router.get("/single/:id", getBannerById);
router.patch("/edit/:id", verifyAdmin, upload, updateBanner);
router.delete("/delete/:id", verifyAdmin, deleteBanner);

module.exports = router;
