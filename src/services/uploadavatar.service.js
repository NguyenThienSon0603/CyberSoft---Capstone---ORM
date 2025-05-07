import { v2 as cloudinary } from "cloudinary";

const uploadAvatar = async (req, next) => {
  const user = req.user;
  const file = req.file;

  if (!file) throw new Error("Không có file");

  // Kết nối cloudinary
  cloudinary.config({
    cloud_name: "nguyenthienson",
    api_key: "264917542585164",
    api_secret: "gUmE4uDQQXfdhGDDKrPzJ01nOs0",
  });

  // Kiểm tra user có avatar chưa => nếu có rồi thì xóa trên cloud
  if (user?.avatar) {
    await cloudinary.uploader.destroy(user.avatar);
  }
  // Upload hình lên cloud
  const uploadResult = await new Promise((resolve) => {
    cloudinary.uploader
      .upload_stream({ folder: "images" }, (error, uploadResult) => {
        return resolve(uploadResult);
      })
      .end(file.buffer);
  });

  return uploadResult;
};
export default uploadAvatar;
