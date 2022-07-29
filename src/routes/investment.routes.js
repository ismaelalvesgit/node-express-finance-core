const prefix = "/investment";
import express from "express";
const router = express.Router();
import verify from "../middleware/verifiy.middleware";
import { updateInvestmentSchema, findAllInvestmentSchema, findAvailableInvestmentSchema, batchInvestmentSchema } from "../validations/investment";
import { findOne, find, update, del, findAvailable, batch } from "../controllers/investment.controller";
import cachedMiddleware from "../middleware/cached.middleware";

/**
 * GET - /investment/available
 * */    
router.route("/available")
    .get(verify(findAvailableInvestmentSchema), findAvailable);

/**
 * GET - /investment/available
 * */    
router.route("/batch")
    .put(verify(batchInvestmentSchema), batch);

/**
 * GET - /investment/:id
 * PUT - /investment/:id
 * DELETE - /investment/:id
 */
router.route("/:id")
    .get(findOne)
    .put(verify(updateInvestmentSchema), update)
    .delete(del);

/**
 * GET - /investment
 * */    
router.route("/")
    .get(verify(findAllInvestmentSchema), cachedMiddleware({path: "investment"}), find);

export {
    prefix,
    router
};