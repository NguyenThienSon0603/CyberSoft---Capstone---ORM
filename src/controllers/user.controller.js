import { responseSuccess } from "../common/helpers/response.helpers";
import userService from "../services/user.service";

const userController = {
  getInfo: async (req, res, next) => {
    try {
      const result = await userService.getInfo(req);
      const response = responseSuccess(
        result,
        "Lấy thông tin thành công.",
        200
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },

  updateInfo: async (req, res, next) => {
    try {
      const result = await userService.updateInfo(req);
      const response = responseSuccess(
        result,
        "Cập nhật thông tin thành công.",
        200
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },
};
export default userController;
