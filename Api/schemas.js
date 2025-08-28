import { object , string} from "yup";

//esto es para seguridad, porque una vez validado lo necesario puede ser que venga algo que no corresponde en el body
export const logingBodySchema = object({
    email: string().email().required(),
    password: string().required()
}).noUnknown(true).strict();

export const registerBodySchema = object({
    name: string().required(),
    email: string().email().required(),
    password: string().required(),
    image: string().url().required()
}).noUnknown(true).strict();

export default logingBodySchema;