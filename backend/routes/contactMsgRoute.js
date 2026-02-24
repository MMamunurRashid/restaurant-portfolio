const router = require("express").Router();
const {
  getAllContactMsgs,
  addContactMsg,
  getContactMsgById,
  deleteContactMsg,
} = require("../controllers/contactMsgController");

router.get("/", getAllContactMsgs);

router.get("/:id", getContactMsgById);
router.post("/add", addContactMsg);

router.delete("/delete/:id", deleteContactMsg);

module.exports = router;
