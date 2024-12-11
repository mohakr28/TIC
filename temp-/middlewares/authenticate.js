const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/jwtConfig");
const User = require("../models/userModel");

module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "لا يوجد توكن" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    // جلب بيانات المستخدم للحصول على رقم التسجيل
    const user = await User.findById(decoded.id);
    if (user) {
      req.user.registrationNumber = user.registrationNumber;
    }

    next();
  } catch (err) {
    res.status(401).json({ message: "توكن غير صالح" });
  }
};
