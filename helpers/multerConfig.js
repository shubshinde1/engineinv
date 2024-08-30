// helpers/multerConfig.js
const multer = require("multer");
const path = require("path");

// Create a default storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify the directory for file uploads
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use the original filename
  },
});

// Set up multer with default storage and a file size limit
const uploader = multer({
  storage: storage,
  limits: { fileSize: 500000 }, // Limit file size to 500KB
});

module.exports = uploader;
