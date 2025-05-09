import { responseSuccess } from "../common/helpers/response.helpers";
import commentService from "../services/comment.service";

const commentController = {
  getCommentsByImageId: async (req, res, next) => {
    try {
      const result = await commentService.getCommentsByImageId(req);
      const response = responseSuccess(
        result,
        "Lấy bình luận ảnh thành công.",
        200
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },
  postComments: async (req, res, next) => {
    try {
      const result = await commentService.postComments(req);
      const response = responseSuccess(
        result,
        "Gửi bình luận thành công.",
        200
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },
};
export default commentController;
