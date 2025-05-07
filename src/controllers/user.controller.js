import { responseSuccess } from "../common/helpers/response.helpers";
import userService from "../services/user.service";

const userController = {
  updateInfo: async (req, res, next) => {
    try {
      const result = await userService.updateInfo(req);
      const response = responseSuccess(result, "Cập nhật thông tin thành công.", 200);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },

  uploadImages: async (req, res, next) => {
    try {
      const result = await userService.uploadImages(req);
      const response = responseSuccess(result, "Tải hình lên thành công.", 200);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },
};
export default userController;
