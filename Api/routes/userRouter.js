import express from 'express';

//todo lo relacionado a usuarios
const createUserRouter = (userController, tokenController) => {
    const userRouter = express.Router();
    
    //userRouter.post("/login", userController.login);
    userRouter.get("/:userId",tokenController.checkRole("user"), userController.getUser);
    
    return userRouter;
}

export default createUserRouter;