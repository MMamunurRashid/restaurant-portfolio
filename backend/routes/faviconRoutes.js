const router = require("express").Router();
const {
  addFavicon,
  updateFavicon,
  getFavicon,
} = require("../controllers/faviconController");
const singleUploader = require("../utils/singleUploader");
const upload = singleUploader("favicon").single("icon");

router.get("/all", getFavicon);
router.post("/add-favicon", upload, addFavicon);
router.patch("/update-favicon/:id", upload, updateFavicon);

module.exports = router;
