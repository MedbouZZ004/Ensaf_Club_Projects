
import multer from "multer";
import path from "path";
import fs from "fs";

// Broad image/video extension support (including HEIC/HEIF)
const IMAGE_EXTS = new Set([
  ".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".svg",
  ".heic", ".heif", ".tif", ".tiff"
]);
const IMAGE_MIMES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

const VIDEO_MIMES = new Set([
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/ogv",
  "video/quicktime", // .mov
  "video/x-matroska", // .mkv
  "video/x-msvideo", // .avi
  "video/3gpp", // .3gp
  "video/x-ms-wmv", // .wmv
  "video/x-flv", // .flv
  "video/mpeg",
]);

const VIDEO_EXTS = new Set([
  ".mp4",
  ".webm",
  ".mov",
  ".mkv",
  ".avi",
  ".3gp",
  ".m4v",
  ".mpeg",
  ".mpg",
  ".ogv",
  ".ogg",
  ".wmv",
  ".flv",
]);

const isImage = (file) => IMAGE_MIMES.has(file.mimetype) || file.mimetype.startsWith("image/");
const isVideo = (file) => {
  if (VIDEO_MIMES.has(file.mimetype) || file.mimetype.startsWith("video/")) return true;
  // Some browsers may send application/octet-stream; fall back to extension
  const ext = path.extname(file.originalname || "").toLowerCase();
  return VIDEO_EXTS.has(ext);
};
// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dest = null;
    const ext = (path.extname(file.originalname || "").toLowerCase()) || "";
    if (file.mimetype.startsWith("image") || IMAGE_EXTS.has(ext)) {
      dest = "uploads/images";
    } else if (file.mimetype.startsWith("video") || VIDEO_EXTS.has(ext)) {
      dest = "uploads/videos";
    } else {
      return cb(new Error("Only images and videos are allowed!"), false);
    }
    try { fs.mkdirSync(dest, { recursive: true }); } catch {}
    // Prefer field names when available
    if (file.fieldname === "clubLogo") dest = "uploads/logo";
    else if (file.fieldname === "clubMainImages") dest = "uploads/images";
    else if (file.fieldname === "clubVideo") dest = "uploads/videos";
    else if (isImage(file)) dest = "uploads/images";
    else if (isVideo(file)) dest = "uploads/videos";
    else return cb(new Error("Only images and videos are allowed!"), false);

    try {
      fs.mkdirSync(dest, { recursive: true });
    } catch {}
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

// File filter (optional)
const fileFilter = (req, file, cb) => {
  const ext = (path.extname(file.originalname || "").toLowerCase()) || "";
  const isImage = file.mimetype.startsWith("image") || IMAGE_EXTS.has(ext);
  const isVideo = file.mimetype.startsWith("video") || VIDEO_EXTS.has(ext);
  if (isImage || isVideo) return cb(null, true);
  return cb(new Error("Invalid file type. Allowed images (incl. HEIC/HEIF) and common videos."), false);

  if (isImage(file) || isVideo(file)) return cb(null, true);
  return cb(new Error("Invalid file type. Allowed: images (jpg, png, webp, gif, svg) and videos (mp4, webm, mov, mkv, avi, more)."), false);
};

const upload = multer({
  storage,
  fileFilter,
  // Increase to 100MB to accommodate more video formats
  limits: { fileSize: 100 * 1024 * 1024 },
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
