const router = require("express").Router();
const verifyAdmin = require("../middleware/verifyAdmin");
const {
  getContacts,
  addContact,
  updateContact,
} = require("../controllers/contactController");

router.get("/", getContacts);
router.patch("/update-contact/:id", verifyAdmin, updateContact);
router.post("/add-contact", verifyAdmin, addContact);

module.exports = router;
