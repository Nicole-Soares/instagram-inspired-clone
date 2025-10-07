import { HEADER } from"../constants.js";
import { registerBodySchema, logingBodySchema as loginBodySchema} from "../schemas.js";
import { transformUser, transformSimpleUser, transformTimeline, transformSimplePost, transformUserWithFollowState } from "../Dtos.js";
import { ValidationError } from "yup";

class UserController {
    
    constructor(system, tokenController) {
        this.system = system;
        this.tokenController = tokenController;
    };

    login = async (req, res) => {
        try {
            const { email, password } = await loginBodySchema.validate(req.body);
            const user = this.system.login(email, password);  
            const token = this.tokenController.generateToken(user.id);
            const posts = this.system.getPostByUserId(user.id).map(transformSimplePost);
            res.header(HEADER, token).json({...transformUser(user), posts }); 
        }
        catch (error) {
            res.status(400).send({error:"el email o la contraseña son incorrectos."});
        }
    };

    register = async (req, res) => {
        try {
            const { name, email, password, image } = await registerBodySchema.validate(req.body, { abortEarly: false })
            const newUser = { name, email, password, image };
            const DraftUser = {
                name: newUser.name,
                email: newUser.email,
                password: newUser.password,
                image: newUser.image,
            }
            const user = this.system.register(DraftUser);
            const token = this.tokenController.generateToken(user.id);

            res.header(HEADER, token).json({...transformUser(user), posts: []});
        }  
        catch (error) {
            if (error instanceof ValidationError) {
                res.status(400).send({error:"Los campos en la construccion del usuario son invalidos."});
            } else {
                res.status(400).send({error:"El email ya se encuentra registrado."});
            }
        }
    };

    //GET /user
    getTimeline = (req, res) => {
        const currentUser = req.user;

        try {
            const timelinePosts = this.system.timeline(currentUser.id);
            res.json({
                ...transformUser(currentUser),
                timeline: timelinePosts.map(transformTimeline)
            });
        } 
        catch (error) {
            res.status(401).send({error:"No esta autorizado para ver el timeline."});
        }
    };

    //GET /user/{userId}
    getUser = (req, res) => {
        try {
            const userId = req.params.userId;
            const user = this.system.getUser(userId);
            const posts = this.system.getPostByUserId(user.id).map(transformSimplePost);
            const currentUserId = req.user?.id;

            res.json({...transformUserWithFollowState(user, currentUserId), posts})
        } 
        catch (error) {
            res.status(404).send({error:"No se encontro el usuario solicitado."});
        }
    };

    //PUT /users/{userId}/follow
    followUser = (req, res) => {
        const userId = req.params.userId; 
        const currentUser = req.user; 

        if (currentUser.id === userId) {
            return res.status(400).send({error:"No puede seguirse a si mismo."});
        }
        
        try {
            this.system.getUser(userId);
            this.system.updateFollower(currentUser.id, userId);
            const updatedProfile = this.system.getUser(userId);
            const posts = this.system.getPostByUserId(updatedProfile.id).map(transformSimplePost);
            
            res.json({ ...transformUserWithFollowState(updatedProfile, currentUser.id), posts});
        }
        catch (error) {
            res.status(404).send({error:"El usuario que intenta seguir no existe."});
        }   
    };
}

export default UserController;