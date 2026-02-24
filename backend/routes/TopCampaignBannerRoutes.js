const router = require("express").Router();
const verifyAdmin = require("../middleware/verifyAdmin");
const {
  addTopCampaignBanner,
  getTopCampaignBanner,
  updateBanner,
} = require("../controllers/topCampaignBannerControllers");
const singleUploader = require("../utils/singleUploader");
const upload = singleUploader("banner").single("image");

router.get("/", getTopCampaignBanner);
router.post("/add", verifyAdmin, upload, addTopCampaignBanner);
router.patch("/update/:id", verifyAdmin, upload, updateBanner);

module.exports = router;
