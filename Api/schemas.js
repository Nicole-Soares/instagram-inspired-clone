import { object , string} from "yup";

//esto es para seguridad, porque una vez validado lo necesario puede ser que venga algo que no corresponde en el body
 const logingBodySchema = object({
    email: string().email().required(),
    password: string().required()
}).noUnknown(true).strict();

 const logingBodySchemaPost = object({
    image: string().required(),
    description: string().required()
}).noUnknown(true).strict();


export {logingBodySchema, logingBodySchemaPost};