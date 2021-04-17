const SocketIO = require('socket.io');

module.exports = function (server) {

const io = SocketIO(server);

io.on('connection',() => {
    console.log("Connected");
});


}
