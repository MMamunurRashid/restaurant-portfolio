const router = require("express").Router();
const {
  createAcademy,
  getAllAcademies,
  getAcademyBySlug,
  getAcademyById,
  updateAcademy,
  deleteAcademy,
} = require("../controllers/academyController");
const singleUploader = require("../utils/singleUploader");

const upload = singleUploader("academies").single("image");

// Routes
router.post("/add-academy", upload, createAcademy);
router.get("/", getAllAcademies);
router.get("/:slug", getAcademyBySlug);
router.get("/:id", getAcademyById);
router.patch("/update-academy/:id", upload, updateAcademy);
router.delete("/delete-academy/:id", deleteAcademy);

module.exports = router;
