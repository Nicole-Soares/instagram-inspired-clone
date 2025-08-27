import { object , string, array} from "yup";

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

export const simpleUser = object({
    id: string().required(),
    name: string().required(),
    image: string().url().required()
}).noUnknown(true).strict(); 

export const comment = object({
    id: string().required(),
    body: string().required(),
    user: simpleUser.required()
}).noUnknown(true).strict();

export const simplePost = object({
    id: string().required(),
    image: string().url().required(),
    description : string().required(),
    user: simpleUser.required(),
    date: string().required(),
    comments: comment.required(),
    likes: simpleUser.required()
}).noUnknown(true).strict();


export const searchResult = object({
    users: array().of(simpleUser).required(),
    posts: array().of(simplePost).required()
}).noUnknown(true).strict();

export default logingBodySchema;