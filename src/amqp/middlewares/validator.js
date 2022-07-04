import { curryN } from "ramda";
import { ValidadeSchema } from "../../utils/erro";

export default curryN(
    2,
    (schema, msg) => {
        const validation = schema.validate(msg, {
          abortEarly: false,
          stripUnknown: true,
          allowUnknown: true,
        });
    
        if (validation.error) {
            throw new ValidadeSchema("message properties", validation.error.details);
        }

        return msg;
    },
);