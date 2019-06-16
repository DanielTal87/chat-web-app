import React, { Component } from 'react';
import io from 'socket.io-client';
import Events from "../Events";
import LoginForm from './LoginForm';
import ChatContainer from './chat/ChatContainer';

const socketUrl = "http://localhost:8889";

class Layout extends Component {

    constructor(props) {
        super(props);

        this.state = {
            socket: null,
            user: null
        };
    }

    componentDidMount() {
        this.initSocket()
    }

    /**
     * Connect and initialize the socket
     */
    initSocket = () => {
        const socket = io(socketUrl);
        socket.on('connect', () => {
        });
        this.setState({ socket });
    };

    setUser = (user) => {
        const { socket } = this.state;
        socket.emit(Events.USER_CONNECTED, user);
        this.setState({ user })
    };

    logout = () => {
        const { socket } = this.state;
        socket.emit(Events.LOGOUT);
        // updateChatHistoryInDb(chatsList)
        this.setState({ user: null })
    };


    render() {
        const { socket, user } = this.state;
        return (
            <div className="container">
                {
                    !user ?
                        <LoginForm socket={socket} setUser={this.setUser}/>
                        :
                        <ChatContainer socket={socket} user={user} logout={this.logout}/>
                }
            </div>
        )
    }
}

export default Layout;