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
};

export default userService;
