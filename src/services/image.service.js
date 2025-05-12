import { BadRequestException } from "../common/helpers/exception.helper";
import prisma from "../common/prisma/init.prisma";
import { v2 as cloudinary } from "cloudinary";
import { DOMAIN } from "../common/constant/app.constant";
import imageExist from "./imageExist.service";

const imageService = {
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

  searchImage: async (req) => {
    let { search } = req.query;
    search = search || "";

    const where = { name: { contains: search } };
    const result = await prisma.images.findMany({
      where: where,
      select: {
        imageId: true,
        name: true,
        url: true,
        userId: true,
        createdAt: true,
      },
    });

    return result;
  },

  getInfoByImageId: async (req) => {
    const { imageId } = req.params;

    // Kiểm tra hình ảnh
    await imageExist(imageId);
    // if (!Number(imageId)) throw new BadRequestException("Không tìm thấy ảnh.");

    // // Kiểm tra ảnh có tồn tại không
    // const imageExist = await prisma.images.findUnique({
    //   where: { imageId: Number(imageId), isDeleted: false },
    // });
    // if (!imageExist) throw new BadRequestException("Hình ảnh không tồn tại.");

    const result = await prisma.images.findUnique({
      where: { imageId: Number(imageId), isDeleted: false },
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
            email: true,
            age: true,
            avatar: true,
          },
        },
      },
    });
    if (!result) throw new BadRequestException("Hình ảnh không tồn tại.");

    return {
      result,
      urlImage: `${DOMAIN}/${result.url}`,
      urlAvatar: `${DOMAIN}/${result.Users.avatar}`,
    };
  },

  saveImages: async (req) => {
    const { userId } = req.user;
    const { imageId } = req.params;
    let result = {};

    // Kiểm tra hình ảnh có tồn tại không
    await imageExist(imageId);

    // Kiểm tra hình đã lưu hay chưa
    const existingSave = await prisma.saveImages.findFirst({
      where: { userId: userId, imageId: Number(imageId) },
    });

    // Nếu ảnh đã từng lưu
    if (existingSave) {
      // Nếu chưa luu
      if (existingSave.isDeleted === false) {
        result = await prisma.saveImages.update({
          where: {
            id: existingSave.id,
          },
          data: { isDeleted: true },
        });
        // Nếu ảnh đã lưu
      } else {
        result = await prisma.saveImages.update({
          where: {
            id: existingSave.id,
          },
          data: { isDeleted: false },
        });
      }
      // Nếu chưa từng lưu
    } else {
      result = await prisma.saveImages.create({
        data: {
          userId: userId,
          imageId: Number(imageId),
          createdAt: new Date(),
        },
      });
    }

    return result;
  },
};
export default imageService;
