const io = require('./index').io;
const Events = require('../Events');
const {createUser, createMessage, createChat} = require('../Factories');
let connectedUsers = {};

module.exports = (socket) => {
    console.log(`Socket Id = ${socket.id}`);

    socket.on(Events.VERIFY_USER, (nickname, callback) => {
        if (isUser(connectedUsers, nickname)) {
            callback({isUser: true, user: null})
        } else {
            callback({isUser: false, user: createUser({name: nickname})})
        }
    });

    socket.on(Events.USER_CONNECTED, (user)=>{
       connectedUsers = addUser(connectedUsers, user);
       socket.user = user;
       io.emit(Events.USER_CONNECTED,connectedUsers);
       console.log(connectedUsers)
    });




    function isUser(userList, username) {
        return username in userList
    }

    function addUser(userList, user) {
        let list = Object.assign({}, userList);
        list[user.name] = user;
        return list
    }

    function removeUser(userList, username) {
        let list = Object.assign({}, userList);
        delete list(username);
        return list
    }

};