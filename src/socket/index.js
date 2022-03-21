import { io } from "../app";
import { Logger } from "../logger";
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

Logger.info("Registered service SOCKET is ON");