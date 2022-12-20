const prefix = "/transaction";
import express from "express";
const router = express.Router();
import verify from "../middleware/verifiy.middleware";
import { createTransactionSchema, findAllTransactionSchema, groupingSchema } from "../validations/transaction";
import { findOne, find, create, update, del, grouping } from "../controllers/transaction.controller";
import cachedMiddleware from "../middleware/cached.middleware";

/**
 * PUT - /transaction/grouping
 * */    
router.route("/grouping")
    .put(verify(groupingSchema), grouping);

/**
 * GET - /transaction/:id
 * PUT - /transaction/:id
 * DELETE - /transaction/:id
 */
router.route("/:id")
    .get(findOne)
    .put(verify(createTransactionSchema), update)
    .delete(del);

/**
 * GET - /transaction
 * POST - /transaction
 * */    
router.route("/")
    .get(verify(findAllTransactionSchema), cachedMiddleware({path: "transaction"}), find)
    .post(verify(createTransactionSchema), create);

export {
    prefix,
    router
};