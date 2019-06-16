const io = require('./index').io;
const Events = require('../Events');
const { createUser, createMessage, createChat } = require('../Factories');

let rndChat = createChat();
let connectedUsers = {};

module.exports = (socket) => {

    let sendMessageToChatFromUser;
    let sendTypingFromUser;

    socket.on(Events.VERIFY_USER, (nickname, callback) => {
        if (isUser(connectedUsers, nickname)) {
            callback({ isUser: true, user: null })
        } else {
            callback({ isUser: false, user: createUser({ name: nickname }) })
        }
    });

    socket.on(Events.USER_CONNECTED, (user) => {
        connectedUsers = addUser(connectedUsers, user);
        socket.user = user;

        sendMessageToChatFromUser = sendMessageToChat(user.name);
        sendTypingFromUser = sendTypingToChat(user.name);
        io.emit(Events.USER_CONNECTED, connectedUsers)
    });

    socket.on('disconnect', () => {
        if ("user" in socket) {
            connectedUsers = removeUser(connectedUsers, socket.user.name);

            io.emit(Events.USER_DISCONNECTED, connectedUsers)
        }
    });

    socket.on(Events.LOGOUT, () => {
        connectedUsers = removeUser(connectedUsers, socket.user.name);
        io.emit(Events.USER_DISCONNECTED, connectedUsers)
    });

    socket.on(Events.RND_CHAT, (callback) => {
        callback(rndChat)
    });

    socket.on(Events.MESSAGE_SENT, ({ chatId, message }) => {
        sendMessageToChatFromUser(chatId, message)
    });

    socket.on(Events.TYPING, ({ chatId, isTyping }) => {
        sendTypingFromUser(chatId, isTyping)
    });

};

function sendTypingToChat(user) {
    return (chatId, isTyping) => {
        io.emit(`${Events.TYPING}-${chatId}`, { user, isTyping })
    }
}

function sendMessageToChat(sender) {
    return (chatId, message) => {
        io.emit(`${Events.MESSAGE_RECEIVED}-${chatId}`, createMessage({ message, sender }))
    }
}

function addUser(userList, user) {
    let list = Object.assign({}, userList);
    list[user.name] = user;
    return list
}

function removeUser(userList, username) {
    let list = Object.assign({}, userList);
    delete list[username];
    return list
}

function isUser(userList, username) {
    return username in userList
}
