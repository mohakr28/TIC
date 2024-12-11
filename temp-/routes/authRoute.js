const router = require("express").Router();
const {
  register,
  login,
  uploadVideo,
} = require("../controllers/authController");
const upload = require("../middlewares/uploadMiddleware");
const authenticate = require("../middlewares/authenticate");

router.post("/register", register);
router.post("/login", login);
// router.post("/upload", authenticate, upload.single("video"), uploadVideo);

module.exports = router;
