import "dotenv/config";
import cors from "cors";

import path from "node:path";
import express from "express";

import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const app = express();
app.use(cors());

import userRouter from "./routes/userRouter.js";
import authRouter from "./routes/authRouter.js";
import nodeRouter from "./routes/nodeRouter.js";
import edgeRouter from "./routes/edgeRouter.js";
import indexRouter from "./routes/indexRouter.js";
import communityRouter from "./routes/communityRouter.js";
import postRouter from "./routes/postRouter.js";
import commentRouter from "./routes/commentRouter.js";
import queryRouter from "./routes/queryRouter.js";
import creditRouter from "./routes/creditRouter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/node", nodeRouter);
app.use("/edge", edgeRouter);
app.use("/community", communityRouter);
app.use("/post", postRouter);
app.use("/comment", commentRouter);
app.use("/query", queryRouter);
app.use("/credit", creditRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));
