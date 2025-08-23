import { HEADER } from"../constants.js";
import { transformUser} from "../Dtos.js";
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

    //va a necesitar hacer el login antes para obtener el token mediante el header

    getUser = (req, res) => {
        const userId = req.params.userId;
        const user = this.system.getUser(userId);
      
        if(user){
          res.json(transformUser(user));
        }
        else{
          res.status(404).send('User not found');
        }
    };
  
}

export default UserController;