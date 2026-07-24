import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "daraz-clone/products",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "avif"],
    transformation: [{ width: 1000, height: 1000, crop: "limit" }],
    public_id: `product-${Date.now()}-${Math.round(Math.random() * 1e9)}`,
  }),
});

const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/avif",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG, WEBP and AVIF images are allowed."));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 10,
  },
});
export const uploadSingle = upload.single("image");
export const uploadMultiple = upload.array("images", 10);

export default upload;
