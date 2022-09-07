const prefix = "/dividends";
import express from "express";
const router = express.Router();
import verify from "../middleware/verifiy.middleware";
import { 
    findAllDividendsSchema, 
    createDividendsSchema, 
    autoCreateDividendsSchema, 
    autoPaidDividendsSchema 
} from "../validations/dividends";
import { findOne, find, create, update, del, autoCreate, autoPaid } from "../controllers/dividends.controller";
import cachedMiddleware from "../middleware/cached.middleware";
import { TIME_DAY } from "../utils/cache";

/**
 * POST - /dividends/autoCreate
 */
 router.route("/autoCreate")
    .post(verify(autoCreateDividendsSchema), autoCreate);

/**
 * POST - /dividends/autoPaid
 */
 router.route("/autoPaid")
    .post(verify(autoPaidDividendsSchema), autoPaid);
    
/**
 * GET - /dividends/:id
 * PUT - /dividends/:id
 * DELETE - /dividends/:id
 */
router.route("/:id")
    .get(findOne)
    .put(verify(createDividendsSchema), update)
    .delete(del);

/**
 * GET - /dividends
 * POST - /dividends
 * */    
router.route("/")
    .get(verify(findAllDividendsSchema), cachedMiddleware({path: "dividends", timeExp: TIME_DAY}), find)
    .post(verify(createDividendsSchema), create);

export {
    prefix,
    router
};