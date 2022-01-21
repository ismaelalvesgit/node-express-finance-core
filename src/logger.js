import winston from "winston";
import "winston-daily-rotate-file";
import env from "./env";

const { 
    format: { combine, colorize, timestamp, json }
} = winston;

const timezoned = () => {
    return new Date().toLocaleString("pt-BR", {
        timeZone: env.timezone
    });
};

const logger = winston.createLogger({
    level: "info",
    format: combine(colorize(), timestamp({format: timezoned}), json()),
    transports: [
        new winston.transports.Console(),
    ],
});

logger.axiosLogger = {
    /**
     * 
     * @param {import('axios').AxiosResponse} req 
     */
    write: (req)=>{
        logger.info(`${req.config.headers.id} - [${new Date().toLocaleString("pt-BR")}] "${req.config.method.toUpperCase()} ${req.config.url}" ${req.status} ${JSON.stringify(req.data)}`);
    }
};

if(env.env === "production"){
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

if(env.env === "test"){
    logger.transports.forEach((t)=> t.silent = true);
}

export default logger;