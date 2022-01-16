const prefix = "/dividends";
import express from "express";
const router = express.Router();
import verify from "../middleware/verifiy.middleware";
import { findAllDividendsTypeSchema, createDividendsTypeSchema } from "../validations/dividends";
import { findOne, find, create, update, del } from "../controllers/dividends.controller";
import cachedMiddleware from "../middleware/cached.middleware";

/**
 * GET - /dividends/:id
 * PUT - /dividends/:id
 * DELETE - /dividends/:id
 */
router.route("/:id")
    .get(findOne)
    .put(verify(createDividendsTypeSchema), update)
    .delete(del);

/**
 * GET - /dividends
 * POST - /dividends
 * */    
router.route("/")
    .get(verify(findAllDividendsTypeSchema), cachedMiddleware(), find)
    .post(verify(createDividendsTypeSchema), create);

export {
    prefix,
    router
};