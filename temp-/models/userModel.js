const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  registrationNumber: { type: String, required: true, unique: true },
  group: {
    type: String,
    required: true,
    enum: ["B1", "B2", "B3", "A1", "A2", "A3"],
  },
  uploadedFilePath: { type: String }, // مسار الملف المرفوع
  externalFileUrl1: { type: String }, // الرابط الخارجي الأول
  externalFileUrl2: { type: String }, // الرابط الخارجي الثاني
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password for login
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
