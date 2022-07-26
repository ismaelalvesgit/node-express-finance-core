const prefix = "/investment";
import express from "express";
const router = express.Router();
import verify from "../middleware/verifiy.middleware";
import { updateInvestmentSchema, createInvestmentSchema, findAllInvestmentSchema, findAvailableInvestmentSchema } from "../validations/investment";
import { findOne, find, create, update, del, findAvailable } from "../controllers/investment.controller";
import cachedMiddleware from "../middleware/cached.middleware";

/**
 * GET - /investment/available
 * */    
router.route("/available")
    .get(verify(findAvailableInvestmentSchema), findAvailable);

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
 * POST - /investment
 * */    
router.route("/")
    .get(verify(findAllInvestmentSchema), cachedMiddleware({path: "investment"}), find)
    .post(verify(createInvestmentSchema), create);

export {
    prefix,
    router
};