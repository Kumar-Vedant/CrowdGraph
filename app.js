require("dotenv").config();

const path = require("node:path");
const express = require("express");
const app = express();

const userRouter = require("./routes/userRouter");
const authRouter = require("./routes/authRouter");
const nodeRouter = require("./routes/nodeRouter");
const edgeRouter = require("./routes/edgeRouter");
const indexRouter = require("./routes/indexRouter");
const queryRouter = require("./routes/queryRouter");
const communityRouter = require("./routes/communityRouter");
const postRouter = require("./routes/postRouter");
const queryRouter = require("./routes/queryRouter");

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
app.use("/query", queryRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));
