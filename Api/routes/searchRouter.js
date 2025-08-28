import express from 'express';


const createSearchRouter = (searchController) => {
    const searchRouter = express.Router();

    // Endpoint for user search
    searchRouter.get("/", searchController.search);

    return searchRouter;
};

export default createSearchRouter;