import { io } from "../app";
import logger from "../logger";
import { ContatoConsume } from "./consumers/Contato.consumer";
import realIp from "./middlewares/realIpMiddleware";

/** Midlewares Global */
io.use(realIp);

/** NameSpaces */
io.on("connection", socket =>{
    [
        ContatoConsume
    ].forEach((consumer)=>{
        new consumer(socket);
    });
});

logger.info("Registered service SOCKET is ON");