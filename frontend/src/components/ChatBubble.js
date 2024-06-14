import { useContext } from 'react';
import axios from 'axios';

import "../css/chatWindow.css";
import { UserContext } from '../context/userContext';

const serverURL = process.env.REACT_APP_BACKEND_URL;

function ChatBubble({ info }) {
    const userContext = useContext(UserContext);

    async function onNameClick(name) {
        let answer = window.confirm("Add user " + name + " to friends?");
        if (answer) {
            try {
                await axios.post(
                    `${serverURL}/authAccounts/friends/`,
                    { id: userContext.id, name: name },
                    { headers: { Authorization: 'bearer ' + userContext.token } }
                ).then((res) => {
                    if (res.ok) {

                    }
                })
            } catch (err) {
                console.log(err.message)
            }
        }
    }

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