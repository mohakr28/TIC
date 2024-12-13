const multer = require("multer");
const path = require("path");

// إعداد التخزين
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); // مسار حفظ الصور
  },
  filename: (req, file, cb) => {
    const registrationNumber = req.user?.registrationNumber || "unknown";
    const extension = path.extname(file.originalname);
    cb(null, `${registrationNumber}-${Date.now()}${extension}`);
  },
});

// فلترة الصور فقط
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/; // السماح بأنواع الصور فقط
  const isAllowed = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  if (isAllowed) {
    cb(null, true); // قبول الملف
  } else {
    cb(null, false); // تجاهل الملف بدون خطأ
  }
};

// تهيئة Multer
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // الحجم الأقصى: 10 ميغابايت
});

module.exports = upload;
