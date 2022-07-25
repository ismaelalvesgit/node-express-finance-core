import dotenv from "dotenv";
import path from "path";

const env = process.env.NODE_ENV ? `../.env.${process.env.NODE_ENV}` : "../.env";
dotenv.config({path: path.join(__dirname, env)});

const url = process.env.SERVER_URL || "http://localhost:3000";
export default {
    env: process.env.NODE_ENV || "development",
    isProd: process.env.NODE_ENV === "production",
    timezone: process.env.TZ || "America/Fortaleza",
    brapi: process.env.BRAPI_URL,
    mercadoBitCoin: process.env.MERCADO_BITCOIN_URL,
    curreyncyApi: process.env.CURRENCY_URL,
    yahoo: process.env.YAHOO_FINANCE_URL,
    yahooKey: process.env.YAHOO_FINANCE_KEY,
    news: process.env.NEWS_URL,
    newsKey: process.env.NEWS_KEY,
    bcb: process.env.BCB_URL,
    iexclound: process.env.IEXCLOUND_URL,
    iexcloundLimitUsage: parseInt(process.env.IEXCLOUND_LIMIT_USAGE || 50000),
    iexcloundKey: process.env.IEXCLOUND_KEY,
    iexcloundKeyAdmin: process.env.IEXCLOUND_KEY_ADMIN,
    yieldapi: process.env.YIELD_URL,
    server:{
        url,
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
        prefix: process.env.REDIS_PREFIX || "finance-core:" 
    },
    apm:{
        serverUrl: process.env.APM_SERVER_URL,
        serviceName: process.env.APM_SERVICE_NAME,
        apiKey: process.env.APM_API_KEY,
        secretToken: process.env.APM_SECRET_TOKEN,
        cloudProvider: process.env.APM_CLOUND_PROVIDER || "none"
    },
    email:{
        type: process.env.EMAIL_TYPE || "OAuth2",
        host: process.env.EMAIL_HOST || "smtp.gmail.com",
        port: process.env.EMAIL_PORT ||  465,
        secure: process.env.EMAIL_SECURE === "true",
        notificator: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
        OAuth2:{
          clientId:  process.env.EMAIL_OAUTH2_CLIENTID,
          clientSecret: process.env.EMAIL_OAUTH2_CLIENTSECRET,
          refreshToken: process.env.EMAIL_OAUTH2_REFRESHTOKEN,
          redirectUri: process.env.EMAIL_OAUTH2_REDIRECT_URI || "https://developers.google.com/oauthplayground"
        },
    },
    amqp:{
        active: process.env.AMQP_ACTIVE === "true",
        protocol: process.env.AMQP_PROTOCOL,
        host: process.env.AMQP_HOSTNAME,
        port: parseInt(process.env.AMQP_PORT || "5672"),
        user: process.env.AMQP_USERNAME,
        password: process.env.AMQP_PASSWORD,
        vhost: process.env.AMQP_VHOST,
    },
    system:{
        fees: {
            outsidePercent: parseInt(process.env.FEES_OUTSIDE_PERCENT || "30")
        },
        files:{
            default: url+"/static/uploads/system/default.png",
            uploadsPath: "./src/public/uploads/",
            uploadsUrl: url+"/static/uploads/"
        }
    }
};