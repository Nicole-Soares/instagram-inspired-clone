import { HEADER } from"../constants.js";
import { registerBodySchema, logingBodySchema as loginBodySchema} from "../schemas.js";
import { transformUser, transformSimpleUser, transformTimeline } from "../Dtos.js";

class UserController {
    
    constructor(system, tokenController) {
        this.system = system;
        this.tokenController = tokenController;
    }

    login = async (req, res) => {

        console.log(req.body)
       try {
            const { email, password } = await loginBodySchema.validate(req.body);
            
            const user = this.system.login(email, password);  
            const token = this.tokenController.generateToken(user.id);

            res.header(HEADER, token).json({user: transformUser(user), token}); 
        }
        catch(error){
            res.status(400).send('Invalid email or password');
        }
    };

    register = async (req, res) => {

        try {
            const {name, email, password, image} = await registerBodySchema.validate(req.body);
        
            const newUser = {name, email, password, image};
            const user = this.system.register(newUser);
            const token = this.tokenController.generateToken(user.id);

            res.header(HEADER, token).json({...transformUser(user), posts: []});
            }  

        catch (error) {
            if (error.name === "ValidationError") {
                return res.status(400).json({ error: "Invalid data" });
                }
            }
    };

    //GET /user
    getTimeline = (req, res) => {
        const currentUser = req.user;

        try {
            const timelinePosts = this.system.timeline(currentUser.id);
            res.json({
                ...transformSimpleUser(currentUser),
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

            if (!user) {
                throw new Error('User not found');
            }

            res.json(transformUser(user));

        } 
        catch (error) {
            res.status(404).send(error.message);
        }
    };

    //PUT /users/{userId}/follow
    followUser = (req, res) => {
        const userId = req.params.userId; //usuario a seguir
        const currentUser = req.user; //usuario que hizo el request

        if (currentUser.id === userId) {
            res.status(400).send('You cannot follow yourself');
            return;
        }
        
        try {
            const userToFollow = this.system.getUser(userId);
            const newCurrentUser = this.system.updateFollower(currentUser.id, userId);
        
            res.json({
            ...transformUser(newCurrentUser),
            posts: this.system.getPostByUserId(newCurrentUser.id).map(transformTimeline)
            }); 
        }
        catch (error) {
            res.status(404).send('User not found');
        }   
    };

}

export default UserController;
