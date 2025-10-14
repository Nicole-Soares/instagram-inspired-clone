import { ValidationError } from "yup";
import { transformUser, transformSimplePost } from "../Dtos.js";
import { bodySchemaPost, bodySchemaPostComment} from "../schemas.js";
import * as yup from 'yup';

class PostController {
    
    constructor(system) {
        this.system = system;
    };

    create = async (req, res) => {
        const bodySchemaPost = yup.object({
            image: yup
                .string()
                .required("La imagen es obligatoria.")
                .test('is-valid-url-or-blob', 'La imagen debe ser una URL válida o un blob.', value =>
                    typeof value === 'string' &&
                    (value.startsWith('http://') ||
                    value.startsWith('https://') ||
                    value.startsWith('blob:')))
        });

        try {       
            const { image, description } = await bodySchemaPost.validate(req.body); // para que no me venga algo raro en el body
            const user = transformUser(req.user); 
            
            const DraftPost = { image: image, description: description };

            const postCreado = await this.system.addPost(user.id, DraftPost);
            res.json(transformSimplePost(postCreado));// modifico el post para que los followers del usuario que lo hizo no generen un loop infinito
        }
        catch (error) {
            if (error instanceof ValidationError) {
                return res.status(400).send({error:"Los campos en la construccion del post son invalidos."});
            }
            else {
                return res.status(401).send({error:"No esta autorizado para crear un post."});
            }
        }
    };  
    
    getPost = (req, res) => {
        try {
            const postId = req.params.postId;
            const post = this.system.getPost(postId);
            res.json(transformSimplePost(post));
        }
        catch (error) {
            res.status(404).json({error:"El post que solicita no fue encontrado."});
        }
  
    };

    updatePost = async (req, res) => {
        const bodySchemaPost = yup.object({
            image: yup
            .string()
            .required("La imagen es obligatoria.")
            .test('is-valid-url-or-blob', 'La imagen debe ser una URL válida o un blob.', value =>
                typeof value === 'string' &&
                (value.startsWith('http://') ||
                value.startsWith('https://') ||
                value.startsWith('blob:')))
        });

        try {
            const postId = req.params.postId;
            const { image, description } = await bodySchemaPost.validate(req.body);
            const DraftPost = {
                image: image,
                description: description
            };
            
            const updatePost = this.system.editPost(postId, DraftPost);
              const post = this.system.getPost(postId);

            if (post.user.id !== req.user.id) { //si el post no lo hizo el mismo user que esta haciendo el request
                return res.status(403).send({error:"No tiene los permisos para modificar este post."});
        }
            res.json(transformSimplePost(updatePost));
        }
        catch(error){
            if(error instanceof ValidationError) {
                return res.status(400).send({error:"Los campos en la construccion del post son invalidos."});
            }
            else{
                return res.status(404).json({error:"El post que solicita no fue encontrado."});
            }
        }
    };

    deletePost = async (req, res) => {
        try {
            const postId = req.params.postId;
            let post = this.system.getPost(postId);
            if (post.user.id !== req.user.id) {
                return res.status(403).send({error:"No tiene los permisos para modificar este post."});
            }
            await this.system.deletePost(postId);
            res.status(204).send({error:"Operación realizada con éxito, no hay contenido para mostrar."});
        } 
        catch (error) {
            res.status(404).json({error:"El post que solicita no fue encontrado."});
        }
    };

    likePost = (req, res) => {
        try {
            let postId = req.params.postId;
            const userId = req.user.id;
            const updatedPost = this.system.updateLike(postId, userId);
            const transformedUpdatedPost = transformSimplePost(updatedPost);
            res.json(transformedUpdatedPost);   
        } 
        catch (error) {
            res.status(404).json({error:"El post que solicita no fue encontrado."});
        }    
    };

    commentPost = async (req, res) => {
        try { 
            const postId = req.params.postId;
            const userId = req.user.id;
            const { body } = await bodySchemaPostComment.validate(req.body);
            const DraftComment = { body: body };
            const commentedPost = this.system.addComment(postId, userId, DraftComment);
            const transformedCommentedPost = transformSimplePost(commentedPost);
            res.json(transformedCommentedPost);
        }
        catch (error) {
            if (error instanceof ValidationError) {
                return res.status(400).send({error:"Los campos en la construccion del post son invalidos."});
            }
            else {
                return res.status(404).json({error:"El post que solicita no fue encontrado."});
            }
        }
    };
}

export default PostController;