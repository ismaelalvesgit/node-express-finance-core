const prefix = "/category";
import express from "express";
const router = express.Router();
import verify from "../middleware/verifiy.middleware";
import { findAllCategorySchema } from "../validations/category";
import { findOne, find, } from "../controllers/category.controller";
import cachedMiddleware from "../middleware/cached.middleware";
import { TIME_DAY } from "../utils/cache";

/**
 * GET - /category/:id
 */
router.route("/:id")
    .get(findOne);

/**
 * GET - /category
 * */    
router.route("/")
    .get(verify(findAllCategorySchema), cachedMiddleware({path: "category", timeExp: 360 * TIME_DAY}), find);

export {
    prefix,
    router
};