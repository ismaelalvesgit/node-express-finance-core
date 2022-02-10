const prefix = "/category";
import express from "express";
const router = express.Router();
import verify from "../middleware/verifiy.middleware";
import { updateCategorySchema, createCategorySchema, findAllCategorySchema } from "../validations/category";
import { findOne, find, create, update, del } from "../controllers/category.controller";
import cachedMiddleware from "../middleware/cached.middleware";

/**
 * GET - /category/:id
 * PUT - /category/:id @deprecated
 * DELETE - /category/:id @deprecated
 */
router.route("/:id")
    .get(findOne)
    .put(verify(updateCategorySchema), update) /** @deprecated */
    .delete(del); /** @deprecated */

/**
 * GET - /category
 * POST - /category @deprecated
 * */    
router.route("/")
    .get(verify(findAllCategorySchema), cachedMiddleware(), find)
    .post(verify(createCategorySchema), create); /** @deprecated */

export {
    prefix,
    router
};