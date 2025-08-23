import { object } from "yup";

//esto es para seguridad, porque una vez validado lo necesario puede ser que venga algo que no corresponde en el body
export const logingBodySchema = object({
    email: string().email().required(),
    password: string().min(6).required()
}).noUnknown(true).strict();