
import multer  from "multer";
import path from "path";
// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, "uploads/images");
    } else if (file.mimetype.startsWith("video")) {
      cb(null, "uploads/videos");
    } 
    else if (file.mimetype.startsWith("logo")){
        cb(null, "uploads/logo");
    }
    else {
      cb(new Error("Only images and videos are allowed!"), false);
    }
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

// File filter (optional)
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image") ||
    file.mimetype.startsWith("video") ||
    file.mimetype.startsWith("logo")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 30 * 1024 * 1024 }, // 30MB max
});

export default upload;




/**
 * Storage Configuration
The multer.diskStorage() configures where and how uploaded files are saved:

Destination: Files are saved to an "uploads/" folder
Filename: Each file gets a unique name using the current timestamp plus a random number, followed by the original file extension (e.g., "1692547832145-123456789.jpg")

File Filtering
The fileFilter function acts as a security measure:

Only allows specific file types: JPEG images, PNG images, and MP4 videos
Accepts the file if its MIME type matches the allowed types
Rejects other file types with an error message

Export
The final upload middleware combines the storage configuration and file filter, making it ready to use in Express.js routes.
 */
