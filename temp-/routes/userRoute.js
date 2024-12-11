const express = require("express");
const {
  getAllUsersWithProjects,
  streamVideo,
  getUser,
} = require("../controllers/userController");
const authenticate = require("../middlewares/authenticate");

const router = express.Router();
// استرجاع جميع المستخدمين ومشاريعهم باستخدام Stream
router.get("/allProjects", getAllUsersWithProjects);

// بث الفيديو المخزن من السيرفر
router.get("/stream-video/:filename", streamVideo);
router.get("/:userId", getUser);

module.exports = router;
