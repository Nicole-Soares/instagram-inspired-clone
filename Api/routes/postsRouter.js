import express from 'express';


const createPostsRouter = (postController, tokenController) => {
    const postsRouter = express.Router();

    postsRouter.post("/", tokenController.checkRole("user"), postController.create); // chequea el token, crea el post
    postsRouter.get("/:postId", tokenController.checkRole("user"), postController.getPost); // chequea el token, trae  el post que tenga ese id
    postsRouter.put("/:postId", tokenController.checkRole("user"), postController.updatePost); // chequea el token, actualiza el post que tenga ese id
    postsRouter.delete("/:postId", tokenController.checkRole("user"), postController.deletePost); // chequea el token, elimina el post que tenga ese id
    postsRouter.put("/:postId/like", tokenController.checkRole("user"), postController.likePost); // chequea el token, le da like al post que tenga ese id
    postsRouter.post("/:postId/comment", tokenController.checkRole("user"), postController.commentPost); // chequea el token, comenta el post que tenga ese id
    return postsRouter;
    
}

export default createPostsRouter;