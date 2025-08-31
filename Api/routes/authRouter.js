import express from 'express';

const createAuthRouter = (userController, tokenController) => {
    const authRouter = express.Router();
    authRouter.post("/login", tokenController.checkRole("public"), userController.login);
    authRouter.post("/register", tokenController.checkRole("public"),userController.register);
    return authRouter;
};

export default createAuthRouter;