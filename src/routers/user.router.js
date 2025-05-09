import express from "express";
import userController from "../controllers/user.controller";
import protectMiddleware from "../common/middleware/protect.middleware";
import avatarCloud from "../common/multer/cloud.multer";

const userRouter = express.Router();
userRouter.get("/getInfo", protectMiddleware, userController.getInfo);

userRouter.put(
  "/updateInfo",
  protectMiddleware,
  avatarCloud.single("avatar"),
  userController.updateInfo
);

export default userRouter;
