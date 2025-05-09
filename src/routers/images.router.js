import protectMiddleware from "../common/middleware/protect.middleware";
import express from "express";
import imageController from "../controllers/images.controller";
import avatarCloud from "../common/multer/cloud.multer";


const imageRouter = express.Router();

imageRouter.get(
  "/getListImages",
  protectMiddleware,
  imageController.getListImagesByUser
);
imageRouter.get(
  "/getInfoByImageId/:imageId",
  protectMiddleware,
  imageController.getInfoByImageId
);
imageRouter.put(
  "/deleteImageByUser/:imageId",
  protectMiddleware,
  imageController.deleteImageByUser
);
imageRouter.get("/searchImage", protectMiddleware, imageController.searchImage);
imageRouter.post(
  "/uploadImage",
  protectMiddleware,
  avatarCloud.single("uploadImage"),
  imageController.uploadImage
);
export default imageRouter;
