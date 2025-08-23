import express from 'express';


const createAuthRouter = (userController, tokenController) => {
    const authRouter = express.Router();

    // Endpoint for user login
    authRouter.post("/login", tokenController.checkRole("public"),userController.login);

    return authRouter;
}

export default createAuthRouter;