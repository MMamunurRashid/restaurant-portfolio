const router = require("express").Router();
const { getColors } = require("../controllers/colorControllers");

router.get("/all-colors", getColors);

module.exports = router;
