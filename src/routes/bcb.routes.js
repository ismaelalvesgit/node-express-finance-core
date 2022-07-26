const prefix = "/bcb";
import express from "express";
const router = express.Router();
import verify from "../middleware/verifiy.middleware";
import { indicadorSchema, querySchema } from "../validations/bcb";
import { 
    selic, 
    inflaction, 
    news, 
    inflactionIndicator, 
    ibovespa,
    ifix,
    ipca,
    cdi,
    bdrx,
    sp500,
    boundList,
    bound,
} from "../controllers/bcb.controller";
import { TIME_DAY } from "../utils/cache";
import cachedMiddleware from "../middleware/cached.middleware";

router.use(cachedMiddleware({path: "bcb", timeExp: TIME_DAY}));

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
 * GET - /bcb/ibovespa
 * */    
router.route("/ibovespa")
    .get(verify(indicadorSchema(["-1", "0", "1", "2", "3", "4"])), ibovespa);

/**
 * GET - /bcb/ifix
 * */    
router.route("/ifix")
    .get(verify(indicadorSchema(["-1", "0", "1", "2", "3", "4"])), ifix);

/**
 * GET - /bcb/bdrx
 * */    
router.route("/bdrx")
    .get(verify(indicadorSchema(["-1", "0", "1", "2", "3", "4"])), bdrx);

/**
 * GET - /bcb/sp500
 * */    
router.route("/sp500")
    .get(verify(indicadorSchema(["1", "2", "3", "4"])), sp500);

/**
 * GET - /bcb/boundList
 * */    
router.route("/boundList")
    .get(boundList);

/**
 * GET - /bcb/bound/:code
 * */    
router.route("/bound/:code")
    .get(verify(indicadorSchema(["1", "2", "3", "4"])), bound);

/**
 * GET - /bcb/ipca
 * */    
router.route("/ipca")
    .get(verify(indicadorSchema(["0", "1", "2"])), ipca);

/**
 * GET - /bcb/cdi
 * */    
router.route("/cdi")
    .get(verify(indicadorSchema(["0", "1", "2"])), cdi);

/**
 * GET - /bcb/news
 * */    
router.route("/news")
    .get(news);

export {
    prefix,
    router
};