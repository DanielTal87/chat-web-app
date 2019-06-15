import React, { Component } from 'react';
import { FaUserPlus } from "react-icons/fa";
import { FaVideo } from "react-icons/fa";
import { MdKeyboard } from "react-icons/md";

class ChatHeading extends Component {
    render() {
        const { name, online, numberOfUsers } = this.props;
        const onlineText = online ? 'online':'offline';
        return (
            <div className="chat-header">
                <div className="user-info">
                    <div className="user-name">{name}</div>
                    <div className="status">
                        <span>{numberOfUsers ? numberOfUsers : null} online</span>
                    </div>
                </div>
                <div className="options">
                    <FaVideo />
                    <FaUserPlus />
                    <MdKeyboard />
                </div>
            </div>
        );
    }
}

export default ChatHeading;