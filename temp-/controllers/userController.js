const User = require("../models/userModel");
const fs = require("fs");
const path = require("path");
const { Readable } = require("stream");

// استرجاع جميع المستخدمين ومشاريعهم باستخدام stream
// exports.getAllUsersWithProjects = async (req, res) => {
//   try {
//     const users = await User.find().lean(); // جلب البيانات من قاعدة البيانات
//     const userStream = new Readable({
//       objectMode: true,
//       read() {
//         users.forEach((user) => this.push(user));
//         this.push(null); // إنهاء التدفق
//       },
//     });

//     res.setHeader("Content-Type", "application/json");
//     userStream.pipe(res); // إرسال التدفق إلى المستجيب
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "حدث خطأ أثناء جلب البيانات", error: err.message });
//   }
// };

exports.getUser = async (req, res) => {
  const { userId } = req.params;
  try {
    // Use the ObjectId in the query
    const userFiles = await User.findById(userId);
    const fileName = userFiles.uploadedFilePath.split("\\").pop();
    userFiles.uploadedFilePath = fileName;

    res.status(200).json(userFiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsersWithProjects = async (req, res) => {
  try {
    const users = await User.find().lean(); // Fetch all users from the database

    res.setHeader("Content-Type", "application/json");
    res.status(200).json(users); // Send the users as a JSON response
  } catch (err) {
    res
      .status(500)
      .json({ message: "حدث خطأ أثناء جلب البيانات", error: err.message });
  }
};

// بث الفيديو من السيرفر
exports.streamVideo = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.resolve("uploads/files", filename);

    // التأكد من وجود الملف
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "الملف غير موجود" });
    }

    const fileExt = path.extname(filename).toLowerCase();

    // التعامل مع ملفات الفيديو
    const videoExtensions = [".mp4", ".webm", ".ogg"];
    if (videoExtensions.includes(fileExt)) {
      const stat = fs.statSync(filePath);
      const fileSize = stat.size;
      const range = req.headers.range;

      if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

        const chunkSize = end - start + 1;
        const file = fs.createReadStream(filePath, { start, end });

        res.writeHead(206, {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunkSize,
          "Content-Type": "video/mp4",
        });

        file.pipe(res);
      } else {
        res.writeHead(200, {
          "Content-Length": fileSize,
          "Content-Type": "video/mp4",
        });

        fs.createReadStream(filePath).pipe(res);
      }
      return;
    }

    // التعامل مع ملفات الصور
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    if (imageExtensions.includes(fileExt)) {
      res.setHeader("Content-Type", `image/${fileExt.slice(1)}`);
      return fs.createReadStream(filePath).pipe(res);
    }

    // تنزيل الملفات الأخرى
    res.download(filePath, filename, (err) => {
      if (err) {
        res
          .status(500)
          .json({ message: "حدث خطأ أثناء تنزيل الملف", error: err.message });
      }
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "حدث خطأ أثناء معالجة الملف", error: err.message });
  }
};
