const multer = require("multer");
const path = require("path");
const fs = require("fs");

const singleUploader = (uploadPath) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      try {
        const fullPath = path.join(process.cwd(), "uploads", uploadPath);

        if (!fs.existsSync(fullPath)) {
          fs.mkdirSync(fullPath, { recursive: true });
        }

        cb(null, fullPath);
      } catch (error) {
        cb(error, null);
      }
    },

    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext);
      const safeName = name.replace(/\s+/g, "_");
      cb(null, `${Date.now()}-${safeName}${ext}`);
    },
  });

  return multer({ storage });
};

module.exports = singleUploader;
