const prefix = "/category";
import express from "express";
const router = express.Router();
import verify from "../middleware/verifiy.middleware";
import { updateCategorySchema, createCategorySchema, findAllCategorySchema } from "../validations/category";
import { findOne, find, create, update, del } from "../controllers/category.controller";
import cachedMiddleware from "../middleware/cached.middleware";

/**
 * GET - /category/:id
 * PUT - /category/:id
 * DELETE - /category/:id
 */
router.route("/:id")
    .get(findOne)
    .put(verify(updateCategorySchema), update)
    .delete(del);

/**
 * GET - /category
 * POST - /category
 * */    
router.route("/")
    .get(verify(findAllCategorySchema), cachedMiddleware(), find)
    .post(verify(createCategorySchema), create);

export {
    prefix,
    router
};