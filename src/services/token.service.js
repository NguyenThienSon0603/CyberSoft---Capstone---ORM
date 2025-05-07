import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_EXPRIRES,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPRIRES,
  REFRESH_TOKEN_SECRET,
} from "../common/constant/app.constant";

const tokenService = {
  createTokens: (userId) => {
    const accessToken = jwt.sign({ userId }, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPRIRES,
    });

    const refreshToken = jwt.sign({ userId: userId }, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPRIRES,
    });

    return { accessToken, refreshToken };
  },
};
export default tokenService;
