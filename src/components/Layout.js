import React, {Component} from 'react';
import io from 'socket.io-client';
import Events from "../Events";
import LoginForm from './LoginForm';
import ChatContainer from './chat/ChatContainer';

const socketUrl = "http://localhost:55895";

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            socket: null,
            user: null
        };
    }

    componentWillMount() {
        this.initSocket()
    }

    /**
     * Connect and initialize the socket
     */
    initSocket = () => {
        const socket = io(socketUrl);
        socket.on('connect', () => {
            console.log("Connected")
        });
        this.setState({socket});
    };

    /**
     * Sets the user property
     * @param user {id:number , name:string}
     */
    setUser = (user) => {
        const {socket} = this.state;
        socket.emit(Events.USER_CONNECTED, user);
        this.setState({user})
    };

    /**
     * Sets the user state to null
     */
    logout = () => {
        const {socket} = this.state;
        socket.emit(Events.LOGOUT);
        this.setState({user: null})
    };


    render() {
        const {socket, user} = this.state;
        const {title} = this.props;
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