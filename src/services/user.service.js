import { BadRequestException } from "../common/helpers/exception.helper";
import prisma from "../common/prisma/init.prisma";
import bcrypt from "bcrypt";
import uploadAvatar from "./uploadavatar.service";
import { v2 as cloudinary } from "cloudinary";
import { DOMAIN } from "../common/constant/app.constant";

const userService = {
  getInfo: async (req) => {
    const userId = req.user.userId;
    if (!userId) throw new BadRequestException("Tài khoản không tồn tại");
    const user = await prisma.users.findUnique({
      where: { userId: userId },
    });
    delete user.password;
    return user;
  },
  updateInfo: async (req) => {
    const { fullName, password, age } = req.body;
    const user = req.user;

    // Kiểm tra dữ liệu truyền vào từ FE
    if (fullName === "" || fullName === null || fullName === undefined)
      throw new BadRequestException("Vui lòng nhập fullName");
    if (password === "" || password === null || password === undefined)
      throw new BadRequestException("Vui lòng nhập password");
    if (age === "" || age === null || age === undefined)
      throw new BadRequestException("Vui lòng nhập age");

    // Mã hóa password
    const salt = bcrypt.genSaltSync(5);
    const hashPassword = bcrypt.hashSync(password, salt);

    const uploadResult = await uploadAvatar(req);
    // Cập nhật lại thông tin tài khoản
    const userUpdate = await prisma.users.update({
      where: {
        userId: Number(user.userId),
      },
      data: {
        fullName: fullName,
        password: hashPassword,
        age: Number(age),
        avatar: uploadResult.public_id,
      },
    });

    delete userUpdate.password;

    return {
      userUpdate,
      urlAvatar: `${DOMAIN}/${userUpdate.avatar}`,
    };
  },

  uploadImage: async (req) => {
    const { name, description } = req.body;
    const user = req.user;
    const file = req.file;

    if (!file) throw new Error("Không có file");

    // Kết nối cloudinary
    cloudinary.config({
      cloud_name: "nguyenthienson",
      api_key: "264917542585164",
      api_secret: "gUmE4uDQQXfdhGDDKrPzJ01nOs0",
    });

    // Upload hình lên cloud
    const uploadResult = await new Promise((resolve) => {
      cloudinary.uploader
        .upload_stream({ folder: "images" }, (error, uploadResult) => {
          return resolve(uploadResult);
        })
        .end(file.buffer);
    });

    // Lưu dữ liệu vào database
    const uploadImages = await prisma.images.create({
      data: {
        userId: user.userId,
        name: name,
        description: description,
        url: uploadResult.public_id,
      },
    });

    return {
      uploadImages,
      urlAvatar: `${DOMAIN}/${uploadImages.url}`,
    };
  },

  getListImagesByUser: async (req) => {
    const userId = req.user.userId;
    if (!userId) throw new BadRequestException("Tài khoản không tồn tại");

    const listImages = await prisma.images.findMany({
      where: { userId: userId, isDeleted: false },
      select: {
        imageId: true,
        name: true,
        url: true,
        description: true,
        createdAt: true,
        Users: {
          select: {
            userId: true,
            fullName: true,
          },
        },
      },
    });

    // Định dạng lại dữ liệu trả về thành Array cho FE
    const result = {};
    listImages.forEach((item) => {
      if (Array.isArray(result[item.Users.userId])) {
        result[item.Users.userId].push(item);
      } else {
        result[item.Users.userId] = [];
        result[item.Users.userId].push(item);
      }
    });

    return result;
  },

  deleteImageByUser: async (req) => {
    const { imageId } = req.params;
    const { userId } = req.user;

    // Lấy thông tin hình ảnh cần xóa
    const image = await prisma.images.findUnique({
      where: { imageId: Number(imageId) },
    });

    if (!image) throw new Error("Hình ảnh bạn muốn xóa không tồn tại.");

    // Kiểm tra hình ảnh có phải của user này tạo không
    if (userId !== image.userId)
      throw new Error("Hình này của người khác, bạn không có quyền xóa.");

    // Xóa hình ảnh
    const result = await prisma.images.update({
      where: { imageId: Number(imageId) },
      data: {
        isDeleted: true,
        deletedBy: userId,
        deletedAt: new Date(),
      },
    });

    return result;
  },
};

export default userService;
