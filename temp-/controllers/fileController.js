const User = require("../models/userModel");
const path = require("path");
const fs = require("fs");

exports.uploadFileWithUrls = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming `isAuthenticated` middleware sets `req.user`
    const { fileUrl, externalFileUrl1, externalFileUrl2 } = req.body;
    console.log("fileeee", req.file);
    // Validate user ID
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Retrieve user from the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete previous file if it exists
    if (user.uploadedFilePath && !fileUrl) {
      const previousFilePath = path.join(
        __dirname,
        "..",
        "uploads/",
        user.uploadedFilePath
      );

      if (fs.existsSync(previousFilePath)) {
        fs.unlinkSync(previousFilePath);
        console.log("Previous file deleted:", previousFilePath);
      }
    }

    // Determine what to save for uploadedFilePath
    if (req.file) {
      // If a file is uploaded, save its path
      user.uploadedFilePath = req.file.filename;
    } else if (fileUrl && fileUrl.startsWith("http")) {
      // If no file is uploaded but a valid URL is provided, save the URL
      user.uploadedFilePath = fileUrl;
    } else {
      return res.status(400).json({ message: "No valid file or URL provided" });
    }

    // Update other external links
    user.externalFileUrl1 = externalFileUrl1 || null;
    user.externalFileUrl2 = externalFileUrl2 || null;

    await user.save();

    res.status(200).json({
      message: "File or URL saved successfully",
      uploadedFilePath: user.uploadedFilePath,
      externalFileUrl1: user.externalFileUrl1,
      externalFileUrl2: user.externalFileUrl2,
    });
  } catch (err) {
    console.error("Error updating file or URL:", err.message);
    res.status(500).json({
      message: "An error occurred while processing the request",
      error: err.message,
    });
  }
};
exports.getFiles = async (req, res) => {
  try {
    const { imageId } = req.params;

    // Construct the full path to the file
    const filePath = path.join(__dirname, "../uploads", imageId);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }
    console.log(filePath);
    // Send the file to the client
    res.status(200).sendFile(filePath);
  } catch (error) {
    console.error("Error fetching file:", error.message);
    res.status(500).json({ message: "Error fetching file", error });
  }
};
