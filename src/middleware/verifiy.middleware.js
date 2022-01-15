import { ValidadeSchema } from "../utils/erro";
/**
 * 
*  @param {import('@hapi/joi').AnySchema} schema 
 * @returns 
 */
export default function verifyHandlerMiddleware(schema){
    return (req, res, next)=>{
        const validation = schema.validate(req, {
            abortEarly: false,
            stripUnknown: true,
            allowUnknown: true
        });

        if (validation.error) {
            return next(new ValidadeSchema(validation.error.details));
        }

        Object.assign(req, validation.value);
        return next();
    };
}