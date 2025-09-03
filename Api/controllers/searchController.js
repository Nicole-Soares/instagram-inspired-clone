import { transformSimplePost, transformSimpleUser } from "../Dtos.js";

class SearchController {
    
    constructor(system) {
        this.system = system;
    };

    search = async (req, res) => { 
        try{
            const { name, userId } = req.query;
            const users = this.system.searchByName(name).map(transformSimpleUser);
            const posts = this.system.searchByUserId(userId).map(transformSimplePost);
        
            res.json({users, posts});
        }
        catch(error){
            res.status(404).json("not found")
        }
    
    };
}

export default SearchController;
