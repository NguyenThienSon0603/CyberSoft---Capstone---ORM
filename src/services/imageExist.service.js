import { BadRequestException } from "../common/helpers/exception.helper";
import prisma from "../common/prisma/init.prisma";

const imageExist = async (imageId) => {
  const id = Number(imageId);
  if (Number.isNaN(id)) throw new BadRequestException("Không tìm thấy ảnh.");

  // Kiểm tra ảnh có tồn tại không
  const imageExist = await prisma.images.findUnique({
    where: { imageId: id, isDeleted: false },
  });
  if (!imageExist) throw new BadRequestException("Hình ảnh không tồn tại.");

  return "";
};
export default imageExist;
