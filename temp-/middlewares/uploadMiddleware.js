const multer = require("multer");
const path = require("path");
const fs = require("fs");

// إعداد التخزين
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/files"); // مسار حفظ الملفات
  },
  filename: (req, file, cb) => {
    const registrationNumber = req.user?.registrationNumber || "unknown";
    const extension = path.extname(file.originalname);
    cb(null, `${registrationNumber}-${Date.now()}${extension}`);
  },
});

// فلترة الملفات
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|mp4|mkv|avi|pdf|doc|docx|txt/;
  const isAllowed = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  if (isAllowed) {
    cb(null, true);
  } else {
    cb(new Error("نوع الملف غير مسموح!"), false);
  }
};

// تهيئة Multer
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // الحجم الأقصى: 10 ميغابايت
});

module.exports = upload;
