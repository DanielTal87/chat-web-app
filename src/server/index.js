var app = require('http').createServer();
var io = module.exports.io = require('socket.io')(app);

const PORT = process.env.PORT || 8889;
const SocketManager = require('./SocketManager');

io.on('connection', SocketManager);
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT} in chat app`)
});
