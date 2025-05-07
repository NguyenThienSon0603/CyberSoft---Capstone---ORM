import { ACCESS_TOKEN_SECRET } from "../constant/app.constant";
import { UnAuthorizationException } from "../helpers/exception.helper";
import jwt from "jsonwebtoken";
import prisma from "../prisma/init.prisma";

const protectMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const [type, token] = authHeader.split(" ");

    // Kiểm tra token
    if (type !== "Bearer")
      throw new UnAuthorizationException("Loại token không hợp lệ");
    if (!token) throw new UnAuthorizationException("Không có token");

    const decode = jwt.verify(token, ACCESS_TOKEN_SECRET);

    const user = await prisma.users.findUnique({
      where: {
        userId: decode.userId,
      },
    });

    if (!user) throw new UnAuthorizationException("Không tìm thấy tài khoản.");

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export default protectMiddleware;
