const router = require("express").Router();
const {
  addTheme,
  getThemes,
  updateTheme,
} = require("../controllers/themeController");

router.post("/add-theme", addTheme);
router.get("/get-themes", getThemes);
router.patch("/update-theme/:id", updateTheme);

module.exports = router;
