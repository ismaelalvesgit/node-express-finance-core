import { Logger } from "../../logger";

export class MainConsume{
    
    /** @type {import('socket.io').Socket} */
    socket

    constructor(socket){
        this.socket = socket;
        this._init();
    }

    _init(){
        this.socket.on("disconnect", ()=>{
            Logger.info("Disconnect Socket");
        });
        this.newClient();
    }

    newClient(){
        this.socket.on("/investment", (msg)=>{
            Logger.info(msg);
        });
    }
}