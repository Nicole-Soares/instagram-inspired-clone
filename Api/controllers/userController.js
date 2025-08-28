import { HEADER } from"../constants.js";
import { transformUser, transformSimpleUser, transformTimeline } from "../Dtos.js";
//define nuestra api, como queremos que se vea

class UserController {
    
    constructor(system, tokenController) {
        this.system = system;
        this.tokenController = tokenController;
    }

    login = async (req, res) => {

        try {
            const { email, password } = req.body;
            const user = this.system.login(email, password);  
            const token = this.tokenController.generateToken(user.id);

            res.header(HEADER, token).json({user: transformUser(user), token}); // le devuelve como respuesta el header con el token y un obj json con el usuario transformado para no generar un loop y el token 
        }
        catch(error){
            res.status(400).send('Invalid email or password');
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
            })
        } 
        catch (error) {
            res.status(401).send('Unauthorized');
        }
    };

    //GET /user/{userId}
    getUser = (req, res) => {
        const userId = req.params.userId;
        const user = this.system.getUser(userId);
      
        if (user) {
          res.json(transformUser(user));
        } else {
          res.status(404).send('User not found');
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

        const userToFollow = this.system.getUser(userId);

        if (!userToFollow) {
            res.status(404).send('User to follow not found');
            return;
        }

        const newCurrentUser = this.system.updateFollower(currentUser.id, userId);
        
        res.json({
            ...transformUser(newCurrentUser),
            posts: this.system.getPostByUserId(newCurrentUser.id).map(transformTimeline)
        }) 
    };
}

export default UserController;
