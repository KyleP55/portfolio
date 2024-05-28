import { useContext } from 'react';

import "../css/chatWindow.css";
import { UserContext } from '../context/userContext';

function ChatBubble({ info }) {
    const userContext = useContext(UserContext);

    if (info.sender === userContext.userName) {
        return (<>
            <div className="bubbleContainerYou padding16">
                <p className="messageText">{info.message}</p>
                <p className="senderText">You</p>
            </div>
        </>);
    } else {
        return (<>
            <div className="bubbleContainerOther padding16">
                <p className="messageText">{info.message}</p>
                <p className="senderText">{info.sender}</p>
            </div>
        </>);
    }
}

export default ChatBubble;