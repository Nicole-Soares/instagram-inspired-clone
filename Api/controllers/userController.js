import { HEADER } from"../constants.js";
import { transformUser } from "../Dtos.js";
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
          
            //no es necesario porque ya esta el try catch
            /*if (user) {
                const token = this.tokenController.generateToken(user.id);

                res.header(HEADER, token).json({user: transformUser(user), token}); // le devuelve como respuesta el header con el token y un obj json con el usuario transformado para no generar un loop y el token 
          
            } else {
                res.status(401).send('Invalid email or password');
            }*/
        }
        catch(error){
            res.status(400).send('Invalid email or password');;
        }
    };

    //GET /user
    getTimeline = (req, res) => {
        const currentUser = req.user;

        if (!currentUser) {
            res.status(401).send('Unauthorized');
            return;
        }

        const timelinePosts = this.system.timeline(currentUser.id);
        res.json(timelinePosts);
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
        const userId = req.params.userId;
        const currentUser = req.user;

        if (currentUser.id === userId) {
            res.status(400).send('You cannot follow yourself');
            return;
        }

        const userToFollow = this.system.getUser(userId);

        if (!userToFollow) {
            res.status(404).send('User to follow not found');
            return;
        }

        const isFollowing = currentUser.following.includes(userId);

        if (isFollowing) {
            // Dejar de seguir
            currentUser.following = currentUser.following.filter(id => id !== userId);
            userToFollow.followers = userToFollow.followers.filter(id => id !== currentUser.id);
        } else {
            // Seguir
            currentUser.following.push(userId);
            userToFollow.followers.push(currentUser.id);
        }

        res.json({
            message: isFollowing ? 'Unfollowed successfully' : 'Followed successfully',
            following: currentUser.following,
            followers: userToFollow.followers
        });
    };
}

export default UserController;
