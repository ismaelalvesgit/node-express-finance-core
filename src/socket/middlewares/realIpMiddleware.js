/**
 * 
 * @param {import('socket.io').Server} socket 
 * @param {Function} next 
 */
export default function realIp(socket, next) {
    if(socket.handshake.headers["x-real-ip"]){
        socket.handshake.address = socket.handshake.headers["x-real-ip"];
    }
    next();
}