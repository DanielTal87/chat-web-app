import React, { Component } from 'react';
import SideBar from './SideBar'
import Events from '../../Events';
import ChatHeading from './ChatHeading'
import Messages from '../messages/Messages'
import MessagesInput from '../messages/MessagesInput'

class ChatContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeChat: null,
            rndChat: null,
            chats: []
        };
        this.resetChat = this.resetChat.bind(this);
        this.removeSocketEvents = this.removeSocketEvents.bind(this);
        this.socketEvents = []
    }

    componentDidMount() {
        const { socket } = this.props;
        socket.emit(Events.RND, this.resetChat);
        this.initSocket()
    }

    componentWillUnmount() {
        this.deinitialize()
    }
    initSocket(){
        const { socket } = this.props;
        socket.on('connect', ()=>{
            socket.emit(Events.RND, this.resetChat)
        })
    }

    deinitialize(){
        const { socket } = this.props;
        this.removeSocketEvents(socket, this.socketEvents)
    }

    removeSocketEvents(socket, events){
        if(events.length > 0){
            socket.off(events[0]);
            this.removeSocketEvents(socket, events.slice(1))
        }
    }

    resetChat = (chat) => {
        return this.addChat(chat, true)
    };

    addChat = (chat, reset) => {
        const { socket } = this.props;
        const { chats } = this.state;
        const newChats = reset ? [ chat ] : [ ...chats, chat ];

        this.setState({ chats: newChats, activeChat: chat });

        const messageEvent = `${Events.MESSAGE_RECEIVED}-${chat.id}`;
        const typingEvent = `${Events.TYPING}-${chat.id}`;

        socket.on(messageEvent, this.addMessageToChat(chat.id));
        socket.on(typingEvent, this.updateTypingInChat(chat.id));

        this.socketEvents.push(messageEvent, typingEvent)

    };

    addMessageToChat = (chatId) => {
        return message => {
            const { chats } = this.state;
            let newChats = chats.map((chat) => {
                if (chat.id === chatId)
                    chat.meesage.push(message);
                return chat
            });
            this.setState({ chats: newChats })
        }
    };

    updateTypingInChat = (chatId) => {
        return ({ isTyping, user }) => {
            if (user !== this.props.user.name) {
                const { chats } = this.state;
                let newChats = chats.map((chat) => {
                    if (chat.id === chatId) {
                        if (isTyping && !chat.typingUsers.includes(user))
                            chat.typingUsers.push(user);
                        else if (!isTyping && chat.typingUsers.includes(user))
                            chat.typingUsers = chat.typingUsers.filter(u => u !== user)
                    }
                    return chat;
                });
                this.setState({ chats: newChats })
            }
        }
    };

    sendMessage = (chatId, meesage) => {
        const { socket } = this.props;
        socket.emit(Events.MESSAGE_SENT, { chatId, meesage })
    };

    sendTyping = (chatId, isTyping) => {
        const { socket } = this.props;
        socket.emit(Events.TYPING, { chatId, isTyping })
    };

    setActiveChat = (chat) => {
        this.setState({ activeChat: chat })
    };

    render() {
        const { user, logout } = this.props;
        const { chats, activeChat } = this.state;
        return (
            <div className="container">
                <SideBar
                    logout={logout}
                    chats={chats}
                    user={user}
                    activeChat={activeChat}
                    setActiveChat={this.setActiveChat}
                />
                <div className="chat-room-container">
                    {
                        activeChat !== null ? (
                                <div className="chat-room">
                                    <ChatHeading
                                        name={activeChat.name}
                                        online={true}
                                    />
                                    <Messages
                                        messages={activeChat.messages}
                                        user={user}
                                        typingUser={activeChat.typingUsers}
                                    />
                                    <MessagesInput
                                        sendMessage={
                                            (message) => {
                                                this.sendMessage(activeChat.id, message)
                                            }
                                        }
                                        sendTyping={
                                            (isTyping) => {
                                                this.sendTyping(activeChat.id, isTyping)
                                            }
                                        }
                                    />
                                </div>
                            ) :
                            <div className="chat-room choose">
                                <h3>Choose a Chat</h3>
                            </div>
                    }
                </div>
            </div>
        );
    }
}

export default ChatContainer;