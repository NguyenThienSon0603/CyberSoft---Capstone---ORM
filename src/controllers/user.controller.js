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

  uploadImage: async (req, res, next) => {
    try {
      const result = await userService.uploadImage(req);
      const response = responseSuccess(
        result,
        "Tải hình ảnh lên thành công.",
        200
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },

  getListImagesByUser: async (req, res, next) => {
    try {
      const result = await userService.getListImagesByUser(req);
      const response = responseSuccess(
        result,
        "Lấy danh sách hình ảnh thành công.",
        200
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },

  deleteImageByUser: async (req, res, next) => {
    try {
      const result = await userService.deleteImageByUser(req);
      const response = responseSuccess(result, "Xóa ảnh thành công.", 200);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },
};
export default userController;
