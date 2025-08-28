import getInstagramSystem from "@unq-ui/instagram-model-js";
import express from "express";
import createUserRouter from "./routes/userRouter.js";
import createUsersRouter from "./routes/usersRouter.js";
import createAuthRouter from "./routes/authRouter.js";
import UserController from "./controllers/userController.js";
import TokenController from "./controllers/tokenController.js";

const system = getInstagramSystem(); // el service
const app = express();
const port = 7070;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const tokenController = new TokenController(system);
const userController = new UserController(system, tokenController);

app.use("/", createAuthRouter(userController, tokenController));
app.use("/user", createUserRouter(userController, tokenController));
app.use("/users", createUsersRouter(userController, tokenController));

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`); 
});
