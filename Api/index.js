import dotenv from "dotenv";
dotenv.config();

import getInstagramSystem from "@unq-ui/instagram-model-js";
import express from "express";
import cors from "cors";

import createUserRouter from "./routes/userRouter.js";
import createUsersRouter from "./routes/usersRouter.js";
import createAuthRouter from "./routes/authRouter.js";
import createSearchRouter from "./routes/searchRouter.js";
import createPostsRouter from "./routes/postsRouter.js";

import UserController from "./controllers/userController.js";
import TokenController from "./controllers/tokenController.js";
import PostController from "./controllers/postController.js";
import SearchController from "./controllers/searchController.js";

const system = getInstagramSystem();
const app = express();
const port = process.env.PORT || 7070;

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:8081",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    exposedHeaders: ["Authorization"]
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const tokenController = new TokenController(system);
const userController = new UserController(system, tokenController);
const postController = new PostController(system);
const searchController = new SearchController(system);

app.use("/", createAuthRouter(userController, tokenController));
app.use("/posts", createPostsRouter(postController, tokenController));
app.use("/user", createUserRouter(userController, tokenController));
app.use("/search", createSearchRouter(searchController));
app.use("/users", createUsersRouter(userController, tokenController));

app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port ${port}`);
});
