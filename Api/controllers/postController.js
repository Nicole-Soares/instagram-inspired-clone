import { ValidationError } from "yup";
import { transformUser, transformPost} from "../Dtos.js";
import { bodySchemaPost } from "../schemas.js";


class PostController {
    constructor(system) {
        this.system = system;
        
    }

    create = async (req, res) => {
       try {

            const { image, description } = await bodySchemaPost.validate(req.body); // para que no me venga algo raro en el body
            const user = transformUser(req.user); //consigo el usuario del req que me puso el tokenController
            
             const draftPost = {
                image: image,
                description: description
            };
            const postCreado = await this.system.addPost(user.id, draftPost);
          
            res.json(transformPost(postCreado));// modifico el post para que los followers del usuario que lo hizo no generen un loop infinito
            
        }
        catch(error){
            if(error instanceof ValidationError) {
                res.status(400).send('Invalid post data');
            }
            else {
                res.status(401).send('Unauthorized');
            }
            
        }
       
    };  
    
    getPost = (req, res) => {
    
        try{
            const postId = req.params.postId;
            const post = this.system.getPost(postId);

            res.json(transformPost(post));
        }
        catch(error){
            res.status(404).send('Post not found');
        }
    };

    updatePost = async (req, res) => {

        //if si el id del usuario que hizo el post es igual al id del usuario que quiere modificar el post (req.user) entonces tiro error
        const postId = req.params.postId;
        const post = this.system.getPost(postId);

        if(post.user.id !== req.user.id){
            return res.status(403).send("Forbidden (User is not the owner of the post)");
        }

        try{
            //const postId = req.params.postId;
            const {image, description} = await bodySchemaPost.validate(req.body);
            const draftPost = {
            image: image,
            description: description
            };
            const updatePost = this.system.editPost(postId, draftPost);
            res.json(transformPost(updatePost));
        }
        catch(error){
            if(error instanceof ValidationError) {
                res.status(400).send('Invalid post data');
            }
            else {
                res.status(404).send('Post not found');
            }
            
        }
       
    }

   deletePost = async (req, res) => {
        const postId = req.params.postId;
        let post;

        try {
            post = this.system.getPost(postId);
        } catch (error) {
            return res.status(404).send("Post not found");
        }

        if (post.user.id !== req.user.id) {
            return res.status(403).send("Forbidden (User is not the owner of the post)");
        }
   
        await this.system.deletePost(postId);
        res.status(204).send("No Content");
    
    }

    likePost = (req, res) => {
        try {
            let postId = req.params.postId;
            const userId = req.user.id;
            const updatedPost = this.system.updateLike(postId, userId);
            const transformedUpdatedPost = transformPost(updatedPost);
            res.json(transformedUpdatedPost);   
            } catch (error) {
                return res.status(404).send("Post not found");
            }
    }
    commentPost = (req, res) => {
        try { 
            const postId = req.params.postId;
            const userId = req.user.id;
            const { comment } = req.body;
            const draftComment = {
                body: comment   
            };
            const commentedPost = this.system.addComment(postId, userId, draftComment);
            const transformedCommentedPost = transformPost(commentedPost);
            res.json(transformedCommentedPost);
        }
        catch (error) {
            return res.status(404).send("Post not found");
        }
    }
}



export default PostController;