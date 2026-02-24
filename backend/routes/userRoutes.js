const router = require("express").Router();
const verifyAdmin = require("../middleware/verifyAdmin");
const verifyToken = require("../middleware/verifyToken");
const {
  registerUser,
  loginUser,
  getMe,
  getAllUsers,
  getAllCustomers,
  updateImage,
  updateInfo,
  deleteAnUser,
} = require("../controllers/userController");
const singleUploader = require("../utils/singleUploader");
const upload = singleUploader("user").single("image");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", verifyToken, getMe);
router.get("/allUsers", verifyAdmin, getAllUsers);
router.get("/allCustomers", verifyAdmin, getAllCustomers);

router.put("/updateImage/:id", verifyToken, upload, updateImage);
router.put("/update/info/:id", verifyToken, updateInfo);
router.delete("/delete/:id", verifyAdmin, deleteAnUser);

module.exports = router;
