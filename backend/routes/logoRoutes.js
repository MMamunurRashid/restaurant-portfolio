const router = require("express").Router();
const verifyAdmin = require("../middleware/verifyAdmin");
const {
  addLogo,
  updateLogo,
  getLogos,
} = require("../controllers/logoController");
const singleUploader = require("../utils/singleUploader");
const upload = singleUploader("logo").single("logo");

router.get("/", getLogos);
router.post("/add-logo", verifyAdmin, upload, addLogo);
router.patch("/update-logo/:id", verifyAdmin, upload, updateLogo);

module.exports = router;
