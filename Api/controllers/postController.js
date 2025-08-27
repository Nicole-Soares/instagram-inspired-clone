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
            res.status(400).send('No se pudo crear el post');;
        }
       
    };  
    
    getPost = (req, res) => {
    
        try{
            const postId = req.params.postId;
            const post = this.system.getPost(postId);

            res.json(transformPost(post));
        }
        catch(error){
            res.status(400).send('No se pudo traer el post');;
        }
    };

    updatePost = async (req, res) => {

        try{
            const postId = req.params.postId;
            const {image, description} = await bodySchemaPost.validate(req.body);
            const draftPost = {
            image: image,
            description: description
            };
            const updatePost = this.system.editPost(postId, draftPost);
            res.json(transformPost(updatePost));
        }
        catch(error){
            res.status(400).send('No se pudo actualizar el post');;
        }
       
    }
  
}

export default PostController;