const router = require("express").Router();
const verifyAdmin = require("../middleware/verifyAdmin");
const {
  addCampaignBanner,
  getCampaignBanners,
  deleteCampaignBanner,
  updateCampaignBanner,
  getCampaignBannerById,
} = require("../controllers/campaignBannerController");
const singleUploader = require("../utils/singleUploader");
const upload = singleUploader("campaignBanner").single("image");

router.post("/add", verifyAdmin, upload, addCampaignBanner);
router.get("/all", getCampaignBanners);
router.get("/single/:id", verifyAdmin, getCampaignBannerById);
router.patch("/edit/:id", verifyAdmin, upload, updateCampaignBanner);
router.delete("/delete/:id", verifyAdmin, deleteCampaignBanner);

module.exports = router;
