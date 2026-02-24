const router = require("express").Router();
const {
  getAboutUs,
  updateAboutUs,
  createAboutUs,
} = require("../controllers/aboutControllers");
const verifyAdmin = require("../middleware/verifyAdmin");
const singleUploader = require("../utils/singleUploader");
const upload = singleUploader("aboutus").single("image");

router.get("/", getAboutUs);
router.post("/add-about", verifyAdmin, upload, createAboutUs);
router.patch("/update-about/:id", verifyAdmin, upload, updateAboutUs);

module.exports = router;
