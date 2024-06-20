import { useContext } from 'react';
import axios from 'axios';

import "../css/chatWindow.css";
import { UserContext } from '../context/userContext';

const serverURL = process.env.REACT_APP_BACKEND_URL;

function ChatBubble({ info, sendFriendRequest }) {
    const userContext = useContext(UserContext);

    // Add Friend
    async function onNameClick(name) {
        let answer = window.confirm("Add user " + name + " to friends?");
        if (answer) {
            sendFriendRequest(name);
        }
    }

    // Bubble Types
    if (info.sender === userContext.userName) {
        return (<>
            <div className="bubbleContainerYou padding16">
                <p className="messageText">{info.message}</p>
                <p className="senderText">You</p>
            </div>
        </>);
    } else {
        return (<>
            <div className="bubbleContainerOther padding16" onClick={onNameClick.bind(this, info.sender)}>
                <p className="messageText">{info.message}</p>
                <p
                    className="senderText"
                >
                    {info.sender}
                </p>
            </div>
        </>);
    }
}

export default ChatBubble;