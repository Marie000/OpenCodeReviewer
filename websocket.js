
var websocket;
function getSocket() {
    return websocket;
}
function setSocket(server, socketIO) {
    return websocket = socketIO(server);
}
module.exports.getSocket = getSocket;
module.exports.setSocket = setSocket; 