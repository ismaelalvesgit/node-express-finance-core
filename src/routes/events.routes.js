const prefix = "/events";
import express from "express";
const router = express.Router();
import verify from "../middleware/verifiy.middleware";
import { findAllEventsSchema } from "../validations/events";
import { findOne, find } from "../controllers/events.controller";
import cachedMiddleware from "../middleware/cached.middleware";
import { TIME_DAY } from "../utils/cache";

/**
 * GET - /events/:id
 */
router.route("/:id")
    .get(findOne);

/**
 * GET - /events
 * */    
router.route("/")
    .get(verify(findAllEventsSchema), cachedMiddleware({path: "events", timeExp: TIME_DAY}), find);

export {
    prefix,
    router
};