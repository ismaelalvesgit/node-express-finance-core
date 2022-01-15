/**
 * @returns {import('express').RequestHandler}
 */
export default (req, res, next)=>{
    const locale = req.query.lang || req.header("accept-language");
    if(locale){
        req.setLocale(locale);
        res.setLocale(locale);
    }
    next();
};