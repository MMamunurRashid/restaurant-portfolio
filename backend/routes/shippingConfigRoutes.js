const router = require("express").Router();
const {
  getShippingConfig,
  addShippingConfig,
  updateShippingConfig,
} = require("../controllers/shippingConfigControllers");

router.get("/", getShippingConfig);
router.post("/add", addShippingConfig);
router.patch("/update/:id", updateShippingConfig);

module.exports = router;
