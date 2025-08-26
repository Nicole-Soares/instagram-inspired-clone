import express from 'express';

//todo lo relacionado a usuarios
const createUserRouter = (userController, tokenController) => {
    const userRouter = express.Router();
    
    //GET /user
    userRouter.get("/", tokenController.checkRole("user"), userController.getTimeline);

    //GET /user/{userId}
    userRouter.get("/:userId", tokenController.checkRole("user"), userController.getUser);
    
    return userRouter;
}

export default createUserRouter;
