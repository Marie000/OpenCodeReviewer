
var websocket;
function getSocket() {
    return websocket;
}
function setSocket(server, socketIO) {
    websocket = socketIO(server);
}
module.exports.getSocket = getSocket;
module.exports.setSocket = setSocket; 