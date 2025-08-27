import express from 'express';


const createPostsRouter = (postController, tokenController) => {
    const postsRouter = express.Router();

    postsRouter.post("/", tokenController.checkRole("user"), postController.create); // chequea el token, crea el post
    postsRouter.get("/:postId", tokenController.checkRole("user"), postController.getPost); // chequea el token, trae  el post que tenga ese id
    postsRouter.put("/:postId", tokenController.checkRole("user"), postController.updatePost); // chequea el token, actualiza el post que tenga ese id
    return postsRouter;
}

export default createPostsRouter;