const User = require("../models/userModel");

exports.uploadFileWithUrls = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming `isAuthenticated` middleware sets `req.user`
    const { fileUrl, externalFileUrl1, externalFileUrl2 } = req.body;

    // Validate user ID
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Validate file URL
    if (!fileUrl || !fileUrl.startsWith("http")) {
      return res.status(400).json({ message: "Invalid file URL" });
    }

    // Retrieve user from the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user record
    user.uploadedFilePath = fileUrl;
    user.externalFileUrl1 = externalFileUrl1 || null;
    user.externalFileUrl2 = externalFileUrl2 || null;
    await user.save();

    res.status(200).json({
      message: "Project links updated successfully",
      uploadedFilePath: user.uploadedFilePath,
      externalFileUrl1: user.externalFileUrl1,
      externalFileUrl2: user.externalFileUrl2,
    });
  } catch (err) {
    console.error("Error updating project links:", err.message);
    res.status(500).json({
      message: "An error occurred while processing the request",
      error: err.message,
    });
  }
};
