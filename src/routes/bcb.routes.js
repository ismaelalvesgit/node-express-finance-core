const prefix = "/bcb";
import express from "express";
const router = express.Router();
import verify from "../middleware/verifiy.middleware";
import { queryIndicador2Schema, queryIndicadorSchema, querySchema } from "../validations/bcb";
import { 
    selic, 
    inflaction, 
    news, 
    inflactionIndicator, 
    ibovespa,
    ifix,
    ipca,
    cdi,
} from "../controllers/bcb.controller";


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
    .get(verify(queryIndicadorSchema), ibovespa);

/**
 * GET - /bcb/ifix
 * */    
router.route("/ifix")
    .get(verify(queryIndicadorSchema), ifix);

/**
 * GET - /bcb/ipca
 * */    
router.route("/ipca")
    .get(verify(queryIndicador2Schema), ipca);

/**
 * GET - /bcb/cdi
 * */    
router.route("/cdi")
    .get(verify(queryIndicador2Schema), cdi);

/**
 * GET - /bcb/news
 * */    
router.route("/news")
    .get(news);

export {
    prefix,
    router
};