import { io } from "../app";
import logger from "../logger";
import { MainConsume } from "./consumers/main.consumer";
import realIp from "./middlewares/realIpMiddleware";

/** Midlewares Global */
io.use(realIp);

/** NameSpaces */
io.on("connection", socket =>{
    [
        MainConsume
    ].forEach((consumer)=>{
        new consumer(socket);
    });
});

logger.info("Registered service SOCKET is ON");