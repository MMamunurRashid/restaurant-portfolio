const router = require("express").Router();
const { getSEO, addSEO, updateSEO } = require("../controllers/seoControllers");

router.get("/", getSEO);
router.post("/add", addSEO);
router.patch("/update/:id", updateSEO);

module.exports = router;
