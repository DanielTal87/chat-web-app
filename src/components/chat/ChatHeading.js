import React from 'react';
import { FaUserPlus } from "react-icons/fa";
import { FaVideo } from "react-icons/fa";
import { MdKeyboard } from "react-icons/md";

export default function ({ name, numberOfUsers }) {
    return (
        <div className="chat-header">
            <div className="user-info">
                <div className="user-name">{name}</div>
                <div className="status">
                    <div className="indicator"/>
                    <span>{numberOfUsers ? numberOfUsers : null} online</span>
                </div>
            </div>
            <div className="options">
                <FaVideo
                    onClick={() => {
                        alert('Will start a video chat in v3.. maybe');
                    }}
                />
                <FaUserPlus
                    onClick={() => {
                        alert('Will open your friends list so you can send a request to add to chat in v2');
                    }}
                />
                <MdKeyboard
                    onClick={() => {
                        alert('Will open a virtual keyboard in v2');
                    }}
                />
            </div>
        </div>
    );
}

