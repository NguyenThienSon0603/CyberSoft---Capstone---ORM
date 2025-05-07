import { responseSuccess } from "../common/helpers/response.helpers";
import authService from "../services/auth.service";

const authController = {
  register: async (req, res, next) => {
    try {
      const result = await authService.register(req);
      const response = responseSuccess(result, "Đăng kí thành công.", 200);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const result = await authService.login(req);
      const response = responseSuccess(result, "Đăng nhập thành công.", 200);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },
};

export default authController;
