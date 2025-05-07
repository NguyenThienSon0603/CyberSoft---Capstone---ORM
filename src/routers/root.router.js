import express from "express";
import authRouter from "./auth.router";
import userRouter from "./user.router";

const rootRouter = express.Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/user", userRouter);

export default rootRouter;
