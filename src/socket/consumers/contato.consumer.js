import logger from "../../logger";

export class ContatoConsume{
    
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
        this.socket.on("/contato", (msg)=>{
            logger.info(msg);
        });
    }
}