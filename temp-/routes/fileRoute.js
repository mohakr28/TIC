const express = require("express");
const upload = require("../middlewares/uploadMiddleware");
const {
  uploadFileWithUrls,
  getFiles,
} = require("../controllers/fileController");
const authenticate = require("../middlewares/authenticate");

const router = express.Router();

router.post(
  "/uploadproject",
  authenticate,
  upload.single("file"),
  uploadFileWithUrls
);
router.get("/:imageId", getFiles);

module.exports = router;
