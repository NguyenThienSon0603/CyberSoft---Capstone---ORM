import {
  BadRequestException,
  UnAuthorizationException,
} from "../common/helpers/exception.helper";
import prisma from "../common/prisma/init.prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import tokenService from "./token.service";

const authService = {
  refreshToken: async (req) => {
    const { accessToken, refreshToken } = req.body;
    if (!accessToken)
      throw new UnAuthorizationException("Không có accessTtoken");
    if (!refreshToken)
      throw new UnAuthorizationException("Không có refreshToken");

    const decodeRefreshToken = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    const decodeAccessToken = jwt.verify(accessToken, ACCESS_TOKEN_SECRET, {
      ignoreExpiration: true, // quan trọng: bỏ qua token hết hạn
    });

    if (decodeRefreshToken.userId !== decodeAccessToken.userId)
      throw new UnAuthorizationException("Token không hợp lệ");

    const newToken = tokenService.createTokens(decodeRefreshToken.userId);
    return newToken;
  },

  register: async (req) => {
    const { fullName, email, password } = req.body;

    // Kiểm tra tài khoản tồn tại chưa
    const userExist = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });
    if (userExist) throw new BadRequestException("Tài khoản đã tồn tại.");

    // Nếu chưa tồn tại thì thêm mới tài khoản
    // Mã hóa password
    const salt = bcrypt.genSaltSync(5);
    const hashPassword = bcrypt.hashSync(password, salt);

    // Thêm mới tài khoản
    const userNew = await prisma.users.create({
      data: {
        fullName: fullName,
        email: email,
        password: hashPassword,
      },
    });

    // Xóa password khi trả dữ liệu về cho FE
    delete userNew.password;

    return userNew;
  },

  login: async (req) => {
    const { email, password } = req.body;

    // Kiểm tra email tồn tại chưa
    const userExist = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });
    // TH1: Nếu chưa tồn tại
    if (!userExist)
      throw new BadRequestException(
        "Tài khoản không tồn tại, vui lòng đăng kí."
      );

    // TH2: Tài khoản đã tồn tại
    const isPassword = bcrypt.compareSync(password, userExist.password);
    if (!isPassword) throw new BadRequestException("Mật khẩu không đúng");

    const tokens = tokenService.createTokens(userExist.userId);

    return tokens;
  },
};

export default authService;
