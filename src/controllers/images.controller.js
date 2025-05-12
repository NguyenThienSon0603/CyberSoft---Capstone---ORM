import { responseSuccess } from "../common/helpers/response.helpers";
import imageService from "../services/image.service";

const imageController = {
  uploadImage: async (req, res, next) => {
    try {
      const result = await imageService.uploadImage(req);
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
      const result = await imageService.getListImagesByUser(req);
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
      const result = await imageService.deleteImageByUser(req);
      const response = responseSuccess(result, "Xóa ảnh thành công.", 200);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },

  searchImage: async (req, res, next) => {
    try {
      const result = await imageService.searchImage(req);
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
  getInfoByImageId: async (req, res, next) => {
    try {
      const result = await imageService.getInfoByImageId(req);
      const response = responseSuccess(
        result,
        "Lấy thông tin hình ảnh thành công.",
        200
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },
  saveImages: async (req, res, next) => {
    try {
      const result = await imageService.saveImages(req);
      const response = responseSuccess(
        result,
        "Lưu hình ảnh thành công.",
        200
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },
};

export default imageController;
