import { curryN } from "ramda";

const toJSON = (v)=>{
    switch (typeof v) {
        case "string": return JSON.parse(v);
        case "object": {
          if (v instanceof Buffer) return JSON.parse(v.toString());
        }
    }
};

const parseMessage = curryN(
    1,
    (msg)=>{
        msg.content = toJSON(msg.content);
        return msg;
    }   
);

export default parseMessage;