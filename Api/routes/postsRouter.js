import express from 'express';


const createPostsRouter = (postController, tokenController) => {
    const postsRouter = express.Router();

    postsRouter.post("/", tokenController.checkRole("user"), postController.create); // chequea el token, crea el post

    return postsRouter;
}

export default createPostsRouter;