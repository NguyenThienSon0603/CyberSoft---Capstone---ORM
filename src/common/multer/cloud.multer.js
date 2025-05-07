import multer from "multer";

const avatarCloud = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1 * 1024 * 1024 },
});
export default avatarCloud;
