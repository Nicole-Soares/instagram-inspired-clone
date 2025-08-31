import express from 'express';

const createUsersRouter = (userController, tokenController) => {
  const router = express.Router();
  router.put('/:userId/follow', tokenController.checkRole('user'), userController.followUser);
  return router;
};

export default createUsersRouter;