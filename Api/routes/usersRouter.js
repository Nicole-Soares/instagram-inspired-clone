import express from 'express';

const createUsersRouter = (userController, tokenController) => {
  const router = express.Router();

  //PUT /users/{userId}/follow
  router.put('/:userId/follow', tokenController.checkRole('user'), userController.followUser);

  return router;
}

export default createUsersRouter;
