import logger from "../../logger";

export class MainConsume{
    
    /** @type {import('socket.io').Socket} */
    socket

    constructor(socket){
        this.socket = socket;
        this._init();
    }

    _init(){
        this.socket.on("disconnect", ()=>{
            logger.info("Disconnect Socket");
        });
        this.newClient();
    }

    newClient(){
        this.socket.on("/investment", (msg)=>{
            logger.info(msg);
        });
    }
}