// backend/src/config/multer.ts

import multer from "multer";
import path from "path";
import fs from "fs";

/**
 * ===============================
 *  UPLOAD DIRECTORY
 * ===============================
 */
const uploadPath = path.join(__dirname, "../../uploads/posters");

// Create folder if not exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

/**
 * ===============================
 *  STORAGE CONFIG
 * ===============================
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

/**
 * ===============================
 *  FILE FILTER
 * ===============================
 */
const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG, WEBP images allowed"));
  }
};

/**
 * ===============================
 *  MULTER INSTANCE
 * ===============================
 */
export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter,
});