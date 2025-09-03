import express from 'express';

const createSearchRouter = (searchController) => {
    const searchRouter = express.Router();
    searchRouter.get("/", searchController.search);
    return searchRouter;
};

export default createSearchRouter;