import express from "express";
import rootRouter from "./src/routers/root.router";
import { PORT } from "./src/common/constant/app.constant";
import logger from "./src/common/winston/init.winston";
import logAPI from "./src/common/morgan/init.morgan";
import cors from "cors";
import { handleError } from "./src/common/helpers/error.helper";

const app = express();

//middleware
app.use(express.json());
app.use(logAPI());
app.use(cors());

app.use(rootRouter);

app.use(handleError);

app.listen(PORT, () => {
  logger.info("Server is running at http://localhost:3070", { tag: "SERVER" });
});
