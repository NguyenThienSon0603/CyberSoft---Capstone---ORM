import express from "express";
import protectMiddleware from "../common/middleware/protect.middleware";
import commentController from "../controllers/comment.controller";

const commentRouter = express.Router();

commentRouter.get(
  "/getCommentByImageId/:imageId",
  protectMiddleware,
  commentController.getCommentsByImageId
);
commentRouter.post(
    "/postComments/",
    protectMiddleware,
    commentController.postComments
  );

export default commentRouter;
