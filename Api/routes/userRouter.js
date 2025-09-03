import express from 'express';

const createUserRouter = (userController, tokenController) => {
    const userRouter = express.Router();
    userRouter.get("/", tokenController.checkRole("user"), userController.getTimeline);
    userRouter.get("/:userId", tokenController.checkRole("public"), userController.getUser);
    return userRouter;
};

export default createUserRouter;