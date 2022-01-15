/**
 * 
 * @param {import('express').RequestHandler} fn 
 * @returns {import('express').RequestHandler}
 */
const catchAsync = (fn) => (req, res, next) => {
    /* eslint-disable no-undef*/
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

export default catchAsync;