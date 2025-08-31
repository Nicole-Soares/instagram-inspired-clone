import { HEADER } from"../constants.js";
import { registerBodySchema, logingBodySchema as loginBodySchema} from "../schemas.js";
import { transformUser, transformSimpleUser, transformTimeline, transformSimplePost } from "../Dtos.js";
import { UserException } from "@unq-ui/instagram-model-js";

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
            res.header(HEADER, token).json({ user:transformUser(user), posts }); 
        }
        catch (error) {
            res.status(400).send('Invalid email or password');
        }
    };

    register = async (req, res) => {
        try {
            const { name, email, password, image } = await registerBodySchema.validate(req.body);
            const newUser = { name, email, password, image };
            const user = this.system.register(newUser);
            const token = this.tokenController.generateToken(user.id);

            res.header(HEADER, token).json({...transformUser(user), posts: []});
        }  
        catch (error) {
            if (error instanceof ValidationError) {
                res.status(400).send('Invalid data');
            }
            else {
                res.status(400).send('User already exists and other errors');
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
            res.status(401).send('Unauthorized');
        }
    };

    //GET /user/{userId}
    getUser = (req, res) => {
        try {
            const userId = req.params.userId;
            const user = this.system.getUser(userId);
            const posts = this.system.getPostByUserId(user.id).map(transformSimplePost);

            if (!user) {
                throw new UserException('User not found');
            }

            res.json({user:transformUser(user), posts})
        } 
        catch (error) {
            res.error(400).send('Something went wrong');
        }
    };

    //PUT /users/{userId}/follow
    followUser = (req, res) => {
        const userId = req.params.userId; 
        const currentUser = req.user; 

        if (currentUser.id === userId) {
            res.status(400).send('You cannot follow yourself');
            return;
        }
        
        try {
            const userToFollow = this.system.getUser(userId);
            const newCurrentUser = this.system.updateFollower(currentUser.id, userId);
            res.json({ ...transformUser(newCurrentUser), posts: this.system.getPostByUserId(newCurrentUser.id).map(transformTimeline) }); 
        }
        catch (error) {
            throw new UserException('User not found');
        }   
    };
}

export default UserController;