import { transformPost, transformSimpleUser} from "../Dtos.js";

class SearchController {
    constructor(system) {
        this.system = system;
    }

    search = async (req, res) => { 
    const { query } = req.query;
    
    const users = this.system.searchByName(query).map(transformSimpleUser);
    const postByTag = this.system.searchByTag(query).map(transformPost);
    const postByUserName = this.system.searchByUserName(query).map(transformPost);    
    let postByUserId = [];
    
    try {
        postByUserId = (this.system.searchByUserId(query) || []).map(transformPost);
    }  
    catch {}
    
    const posts  = [...postByTag, ...postByUserName,...postByUserId]; 
    res.json({users, posts});
    }

}

export default SearchController;