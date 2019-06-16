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
    }

    componentDidMount() {
        const { socket } = this.props;
        socket.emit(Events.RND_CHAT, this.resetChat);
    }

    resetChat = (chat) => {
        return this.addChat(chat, true)
    };

    addChat = (chat, reset) => {
        const { socket } = this.props;
        const { chats } = this.state;
        const newChats = reset ? [ chat ] : [ ...chats, chat ];
        this.setState({ chats: newChats, activeChat: chat ? chat : this.state.activeChat });
        const messageEvent = `${Events.MESSAGE_RECEIVED}-${chat.id}`;
        const typingEvent = `${Events.TYPING}-${chat.id}`;
        /* if(chat in chats)
             getChatHistoryFromDb(chat);
         else
             createNewChatHistory(chat.name;
        */
        socket.on(typingEvent, this.updateTypingInChat(chat.id));
        socket.on(messageEvent, this.addMessageToChat(chat.id));
    };

    addMessageToChat = (chatId) => {
        return message => {
            const { chats } = this.state;
            let newChats = chats.map((chat) => {
                if (chat.id === chatId)
                    chat.messages.push(message);
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
                        if (isTyping && !chat.typingUsers.includes(user)) {
                            chat.typingUsers.push(user)
                        } else if (!isTyping && chat.typingUsers.includes(user)) {
                            chat.typingUsers = chat.typingUsers.filter(u => u !== user)
                        }
                    }
                    return chat
                });
                this.setState({ chats: newChats })
            }
        }
    };

    sendMessage = (chatId, message) => {
        const { socket } = this.props;
        socket.emit(Events.MESSAGE_SENT, { chatId, message })
    };

    sendTyping = (chatId, isTyping) => {
        const { socket } = this.props;
        socket.emit(Events.TYPING, { chatId, isTyping })
    };

    setActiveChat = (activeChat) => {
        this.setState({ activeChat })
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
                                    <ChatHeading name={activeChat.name}/>
                                    <Messages
                                        messages={activeChat.messages}
                                        user={user}
                                        typingUsers={activeChat.typingUsers}
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