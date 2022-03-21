import { v4 as uuidv4 } from "uuid";
/**
 * @returns {import('express').RequestHandler}
 */
export default (req, res, next) => {
    req.requestId = uuidv4();
    return next();
};