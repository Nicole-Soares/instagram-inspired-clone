import { HEADER } from"../constants.js";
import { transformPost } from "../Dtos.js";
import { searchResult } from "../schemas.js";


class SearchController {
    constructor(system) {
        this.system = system;
    }
    

    search = async (req, res) => { // Recibimos el nombre por query string
    const query = req.query.query;

    if (!query) {
        return res.status(400).json({ error: "Se requiere el parámetro 'query'" });
    }
    
    const users = this.system.searchByName(query).map(user => ({ id: user.id, name: user.name, image: user.image }));
    const postByTag = this.system.searchByTag(query).map(post => (transformPost(post)));
    const postByUserName = this.system.searchByUserName(query).map(post => (transformPost(post)));
    //const postByUserId = this.system.searchByUserId(query).map(post => (transformPost(post)));
    
    const post  = [...postByTag, ...postByUserName]; 
     // Eliminar duplicados
    res.json({users, post}); // Devolver el resultado como JSON
    }
}
export default SearchController;