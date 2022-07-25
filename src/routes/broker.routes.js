const prefix = "/broker";
import express from "express";
const router = express.Router();
import verify from "../middleware/verifiy.middleware";
import { updateBrokerSchema, createBrokerSchema, findAllBrokerSchema } from "../validations/broker";
import { findOne, find, create, update, del } from "../controllers/broker.controller";
import cachedMiddleware from "../middleware/cached.middleware";

/**
 * GET - /broker/:id
 * PUT - /broker/:id
 * DELETE - /broker/:id
 */
router.route("/:id")
    .get(findOne)
    .put(verify(updateBrokerSchema), update)
    .delete(del);

/**
 * GET - /broker
 * POST - /broker
 * */    
router.route("/")
    .get(verify(findAllBrokerSchema), cachedMiddleware({path: 'broker', timeExp: 300}), find)
    .post(verify(createBrokerSchema), create);

export {
    prefix,
    router
};