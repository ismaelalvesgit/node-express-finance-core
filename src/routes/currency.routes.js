const prefix = "/currency";
import express from "express";
const router = express.Router();
import { find, available, code, del, create } from "../controllers/currency.controller";
import verify from "../middleware/verifiy.middleware";
import { createCurrencySchema } from "../validations/currency";


/**
 * GET - /currency/available
 * */
router.route("/available")
    .get(available);

/**
 * GET - /currency/code
 * */
router.route("/code")
    .get(code);

/**
* GET - /currency
* POST - /currency 
*/
router.route("/")
    .get(find)
    .post(verify(createCurrencySchema), create);

/**
 * DELETE - /currency/:id
 */
router.route("/:id")
    .delete(del);

export {
    prefix,
    router
};