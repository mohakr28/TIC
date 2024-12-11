const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRES_IN } = require("../config/jwtConfig");
const userModel = require("../models/userModel");

// Register user
exports.register = async (req, res) => {
  try {
    const { username, email, password, registrationNumber, group } = req.body;

    // Check if registration number is unique
    const existingUser = await User.findOne({ registrationNumber });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Registration number already in use" });
    }

    // Create user
    const user = new User({
      username,
      email,
      password,
      registrationNumber,
      group,
    });
    console.log("entred");
    await user.save();

    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Create a JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    // Exclude the password from the response
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    // Send response with user data and JWT token
    res
      .status(200)
      .json({ message: "Login successful", token, user: userWithoutPassword });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Upload video
exports.uploadVideo = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if video already uploaded
    if (user.videoPath) {
      return res.status(400).json({ message: "User already uploaded a video" });
    }

    // Save video path
    user.videoPath = req.file.path;
    await user.save();

    res.status(200).json({
      message: "Video uploaded successfully",
      videoPath: user.videoPath,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
