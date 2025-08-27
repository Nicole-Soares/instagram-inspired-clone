import { HEADER } from"../constants.js";
import { transformUser} from "../Dtos.js";
import { registerBodySchema, logingBodySchema as loginBodySchema} from "../schemas.js";
//define nuestra api, como queremos que se vea

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

    register = async (req, res) => {
        try {
        
        const { name, email, password, image } = await registerBodySchema.validate(req.body);
       
        // Verificar si el usuario ya existe en el sistema
        const existingUser = this.system.validateNewUser(email);
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Registrar el usuario 
        const user = this.system.register(name, email, password, image);
        const token = this.tokenController.generateToken(user.id);

        // Respuesta exitosa
        res.header(HEADER, token).json({user: transformUser(user)});
        }     
        catch (error) {
        // Si el error es de validación
        if (error.name === "ValidationError") {
            return res.status(400).json({ error: "Invalid data" });
        }
        // Otros errores
        res.status(400).json({ error: error.message });
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