const express = require("express");
const upload = require("../middlewares/uploadMiddleware");
const { uploadFileWithUrls } = require("../controllers/fileController");
const authenticate = require("../middlewares/authenticate");

const router = express.Router();

router.post(
  "/uploadproject",
  authenticate,
  // upload.single("file"),
  uploadFileWithUrls
);

module.exports = router;
