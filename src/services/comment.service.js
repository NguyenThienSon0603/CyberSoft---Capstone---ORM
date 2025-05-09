import { BadRequestException } from "../common/helpers/exception.helper";
import prisma from "../common/prisma/init.prisma";
import imageExist from "./imageExist.service";

const commentService = {
  getCommentsByImageId: async (req) => {
    const { imageId } = req.params;

    if (!Number(imageId)) throw new BadRequestException("Không tìm thấy ảnh.");

    // Kiểm tra ảnh có tồn tại không
    const imageExist = await prisma.images.findUnique({
      where: { imageId: Number(imageId), isDeleted: false },
    });
    if (!imageExist) throw new BadRequestException("Hình ảnh không tồn tại.");

    const result = await prisma.comments.findMany({
      where: { imageId: Number(imageId), isDeleted: false },
      select: {
        content: true,
        createdAt: true,
      },
    });

    if (result.length === 0)
      throw new BadRequestException("Không có bình luận nào.");

    // Định dạng lại dữ liệu trả về
    const formatResult = {};
    result.forEach((item) => {
      if (Array.isArray(formatResult[imageId])) {
        formatResult[imageId].push(item);
      } else {
        formatResult[imageId] = [];
        formatResult[imageId].push(item);
      }
    });

    return formatResult;
  },

  postComments: async (req) => {
    const { imageId, content } = req.body;
    const { userId } = req.user;

    // Kiểm tra hình ảnh trước khi comment
    await imageExist(imageId);

    const result = await prisma.comments.create({
      data: {
        userId: userId,
        imageId: Number(imageId),
        content: content,
      },
    });
    return result;
  },
};
export default commentService;
