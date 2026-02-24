const router = require("express").Router();
const {
  add,
  get,
  getSingle,
  destroy,
} = require("../controllers/galleryController");
const singleUploader = require("../utils/singleUploader");
const upload = singleUploader("gallery").single("image");

router.get("/", get);
router.get("/:id", getSingle);
router.post("/add", upload, add);
router.delete("/delete/:id", destroy);

module.exports = router;
