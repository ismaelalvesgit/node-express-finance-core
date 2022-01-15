import dotenv from "dotenv";
dotenv.config();

const url = process.env.SERVER_URL || "http://localhost:3000";
export default {
    env: process.env.NODE_ENV || "development",
    timezone: process.env.TIME_ZONE || "America/Fortaleza",
    brapi: process.env.BRAPI_URL,
    server:{
        url,
        active: process.env.SERVER_ACTIVE === "true",
        port: parseInt(process.env.SERVER_PORT || "3000"),
        bodyLimit: process.env.SERVER_BODY_LIMIT || "500kb"
    },
    db:{
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        debug: process.env.DB_DEBUG === "true"
    },
    redis:{
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || "6379"),
        prefix: process.env.REDIS_PREFIX || "finance" 
    },
    apm:{
        serverUrl: process.env.APM_SERVER_URL,
        serviceName: process.env.APM_SERVICE_NAME,
        apiKey: process.env.APM_API_KEY,
        secretToken: process.env.APM_SECRET_TOKEN,
    },
    system:{
        files:{
            default: url+"/static/uploads/system/default.png",
            uploadsPath: "./src/public/uploads/",
            uploadsUrl: url+"/static/uploads/"
        }
    }
};