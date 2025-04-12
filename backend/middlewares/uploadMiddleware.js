import multer from "multer";

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Set destination directory
  },
  filename: (req, file, cb) => {
    // Set the filename to be a combination of timestamp and original name
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File Filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpg", "image/png", "image/jpeg"]; // Corrected the types list
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept file
  } else {
    cb(new Error("Only .jpeg, .png and .jpg formats are accepted"), false); // Reject file
  }
};

// Create multer upload instance
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
});
