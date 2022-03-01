const prefix = "/news";
import express from "express";
const router = express.Router();
import verify from "../middleware/verifiy.middleware";
import { findAllNewsSchema } from "../validations/news";
import { find } from "../controllers/news.controller";


/**
 * GET - /news
 * */    
router.route("/")
    .get(verify(findAllNewsSchema), find);

export {
    prefix,
    router
};