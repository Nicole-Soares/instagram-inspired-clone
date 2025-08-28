import express from 'express';


const createAuthRouter = (userController, tokenController) => {
    const authRouter = express.Router();

    // Endpoint for user login
    authRouter.post("/login", tokenController.checkRole("public"), userController.login);

    // Endpoint for user register
    
    authRouter.post("/register", tokenController.checkRole("public"),userController.register);

    return authRouter;
};

export default createAuthRouter;