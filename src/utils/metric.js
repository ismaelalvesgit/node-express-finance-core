import { register, Counter, Summary, collectDefaultMetrics} from "prom-client";
import ResponseTime from "response-time";
import logger from "../logger";

const excludeUrl = [
    "/",
    "/favicon.ico",
    "/system/metrics",
    "/system/healthcheck"
];

export const numOfRequests = new Counter({
    name: "numOfRequests",
    help: "Numero de requesições",
    labelNames: ["method"]
});

export const pathsTaken = new Counter({  
    name: "pathsTaken",
    help: "Caminhos percorridos na aplicação",
    labelNames: ["path"]
});

export const responses = new Summary({  
    name: "responses",
    help: "Tempo de resposta em milis",
    labelNames: ["method", "path", "statusCode"]
});

export const responseCounters = ResponseTime((req, res, time) =>{  
    if(!excludeUrl.includes(req.path)) {
        responses.labels(req.method, req.url, res.statusCode).observe(time);
    }
});

export const requestCounters = (req, res, next)=>{
    if(!excludeUrl.includes(req.path)) {
        numOfRequests.inc({ method: req.method });
        pathsTaken.inc({ path: req.path });
    }
    next();
};

export const startCollection = ()=>{
    collectDefaultMetrics();
    logger.info("Registered service collect METRICS is ON");
};

/**
 * 
 * @param {import('express').Express} app 
 */
export const injectMetricsRoute = (app)=>{
    app.get("/system/metrics", (req, res, next) => {
        res.set("Content-Type", register.contentType);
        register.metrics()
        .then((metrics)=>{
            res.send(metrics);
        }).catch(next);
    });
};