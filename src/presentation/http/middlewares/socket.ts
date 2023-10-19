import { RequestHandler } from "express";
import { Server } from "socket.io";

const socketIo = (io: Server): RequestHandler =>{
    return (req, _, next)=>{
        req.io = io,
        next();
    };
};

export default socketIo;