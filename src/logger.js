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
        new winston.transports.DailyRotateFile({
            filename: "./logs/%DATE%.log",
            datePattern: "DD-MM-YYYY",
            maxSize: "20m",
            maxFiles: "14d",
            handleExceptions: true
        }),
        new winston.transports.Console(),
    ],

});

if(env.env === "production"){
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

if(env.env === "test"){
    logger.transports.forEach((t)=> t.silent = true);
}

export default logger;