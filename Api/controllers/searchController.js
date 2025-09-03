import { transformSimplePost, transformSimpleUser } from "../Dtos.js";

class SearchController {
    
    constructor(system) {
        this.system = system;
    };

    search = async (req, res) => { 
        
            const { query } = req.query;
            
            const users = this.system.searchByName(query).map(transformSimpleUser);
            const posts = this.system.searchByTag(query).map(transformSimplePost);
        
            res.json({users, posts});
    };
}

export default SearchController;
