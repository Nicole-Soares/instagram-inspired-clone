import express from 'express';

const createPostsRouter = (postController, tokenController) => {
    const postsRouter = express.Router();
    postsRouter.post("/", tokenController.checkRole("user"), postController.create); 
    postsRouter.get("/:postId", tokenController.checkRole("public"), postController.getPost); 
    postsRouter.put("/:postId", tokenController.checkRole("user"), postController.updatePost); 
    postsRouter.delete("/:postId", tokenController.checkRole("user"), postController.deletePost); 
    postsRouter.put("/:postId/like", tokenController.checkRole("user"), postController.likePost); 
    postsRouter.post("/:postId/comment", tokenController.checkRole("user"), postController.commentPost); 
    return postsRouter;
};

export default createPostsRouter;