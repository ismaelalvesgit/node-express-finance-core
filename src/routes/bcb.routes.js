const prefix = "/bcb";
import express from "express";
const router = express.Router();
import verify from "../middleware/verifiy.middleware";
import { querySchema } from "../validations/bcb";
import { selic, inflaction, news, inflactionIndicator } from "../controllers/bcb.controller";


/**
 * GET - /bcb/selic
 * */    
router.route("/selic")
    .get(verify(querySchema), selic);

/**
 * GET - /bcb/inflaction
 * */    
router.route("/inflaction")
    .get(verify(querySchema), inflaction);

/**
 * GET - /bcb/inflactionIndicator
 * */    
router.route("/inflactionIndicator")
    .get(verify(querySchema), inflactionIndicator);

/**
 * GET - /bcb/news
 * */    
router.route("/news")
    .get(news);

export {
    prefix,
    router
};