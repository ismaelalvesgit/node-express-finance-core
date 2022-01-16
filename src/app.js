import dotenv from "dotenv";
import express from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import hidePoweredBy from "hide-powered-by";
import hsts from "hsts";
import xssFilter from "x-xss-protection";
import morgan from "morgan";
import swagger from "swagger-ui-express";
import YAML from "yamljs";
import { readdirSync } from "fs";
const swaggerDocument = YAML.load("./doc/swagger.yml");
import uuidMiddleware from "./middleware/uuid.middleware";
import changeLocaleMiddleware from "./middleware/changeLocale.middleware";
import env from "./env";
import path from "path";
import { requestCounters, responseCounters, injectMetricsRoute } from "./utils/metric";
import responseTime from "response-time";
import i18n from "./i18n";
import { Server } from "socket.io";
import ioRedis from "socket.io-redis";

/** Instances */
dotenv.config();
const app = express();
const httpServer =  http.createServer(app);
const io = new Server(httpServer, {
    cors:{
        origin: "*",
    }
});

/** Socket Adpters */
if(env.redis.host){
    io.adapter(ioRedis({
        host: env.redis.host,
        port: env.redis.port,
    }));
}

/** Middlewares */
app.use(cors());
app.use(express.json({limit: env.server.bodyLimit}));
app.use(express.urlencoded({extended: true}));
app.use(helmet());
app.use(hsts({
    maxAge: 31536000,
    includeSubDomains: true, 
    preload: true
}));
app.use(xssFilter());
app.use(hidePoweredBy());
app.use(responseCounters);
app.use(requestCounters);
app.use(responseTime());
app.use(i18n.init);
app.use(uuidMiddleware);
app.use(changeLocaleMiddleware);

/** Engine View */
app.set("view engine", "ejs");
app.set("views", "./src/views");

/** Assets */
app.use("/static", express.static(path.join(__dirname, "/public")));

/** Logger */
morgan.token("id", (req)=>{
    return req.id;
});
morgan.token("date", function() {
    return new Date().toLocaleString("pt-BR");
});
morgan.token("body", (req) => JSON.stringify(req.body));

app.use(morgan(":id :remote-addr - :remote-user [:date[clf]] \":method :url HTTP/:http-version\" :status :res[content-length] :body \":referrer\" \":user-agent\""));

/** Metric Endpoint */
injectMetricsRoute(app);

/** Routers */
app.get("/", (req, res)=>{
    res.render("index");
});

app.use("/api-doc", swagger.serve, swagger.setup(swaggerDocument));

/** Routers Auto Import */
readdirSync("./src/routes/").forEach((file)=>{
    const { prefix, router } = require(path.join(__dirname, "..", "src/routes", file ));
    app.use(prefix, router);
});

//** Default Router */
app.all("*", (req, res)=>{
    res.status(404).json([{message: "Rota Não Encontrada"}]);
});

export { io, app, httpServer };