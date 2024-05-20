const multer = require("multer");
const crypto = require("crypto");
const path = require("path");

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    const hash = crypto
      .createHash("md5")
      .update(Date.now().toString() + file.originalname)
      .digest("hex");
    const extension = path.extname(file.originalname);
    cb(null, `${hash}${extension}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/png", "image/jpeg", "image/jpg"];
  allowedMimeTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
};

const storage = multer({ storage: diskStorage, fileFilter: fileFilter }).single(
  "image"
);

module.exports = storage;
