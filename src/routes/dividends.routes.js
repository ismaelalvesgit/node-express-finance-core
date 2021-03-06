const prefix = "/dividends";
import express from "express";
const router = express.Router();
import verify from "../middleware/verifiy.middleware";
import { findAllDividendsSchema, createDividendsSchema } from "../validations/dividends";
import { findOne, find, create, update, del } from "../controllers/dividends.controller";
import cachedMiddleware from "../middleware/cached.middleware";
import { TIME_DAY } from "../utils/cache";

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