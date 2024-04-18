const path = require("path");
const multer = require("multer");
const shortid = require("shortid");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploadImages');
  },
  filename: (req, file, cb) => {
    const uniqueIdentifier = shortid.generate();
    const extension = path.extname(file.originalname);
    const uniqueFilename = `${uniqueIdentifier}${extension}`;
    cb(null, uniqueFilename);
  }
});

const UploadMedia = multer({
  storage: storage,
});

module.exports = UploadMedia;
