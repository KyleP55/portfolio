import { useState, useContext, useEffect } from "react";
import axios from "axios";

import { UserContext } from "../context/userContext";
import ChatBubble from "./ChatBubble";

const serverURL = process.env.REACT_APP_BACKEND_URL;


function ChatWindow({ room }) {
    const userContext = useContext(UserContext);
    const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState();

    // Get Messages on Load
    useEffect(() => {
        async function getChat() {
            axios.get(`${serverURL}/Messages/${room}`)
                .then((res) => {
                    setChatMessages(res.data);
                });
        }
        document.getElementById('messageInput').focus();

        if (userContext.id) getChat();
    }, [room]);

    // Send Message
    async function onSend() {
        let date = new Date();

        if (message !== '') {
            const info = {
                room: room,
                message: message,
                sender: userContext.userName,
                date: date.toString()
            }

            try {
                await axios.post(`${serverURL}/Messages/`, info);
            } catch (err) {
                alert(err);
            }

            //socket.emit('sendMessage', room, info);
            setMessage('');
        }

        document.getElementById('messageInput').focus();
    }

    return (<>
        <div className="col-md-10 col-lg-10 p-0 maxVH chatContainer">
            <div className="messageBox">
                <input
                    type="text"
                    placeholder='Message'
                    onChange={(e) => setMessage(e.target.value)}
                    value={message}
                    className="inputBar"
                    id="messageInput"
                    onKeyDown={(e) => {
                        if (e.key === "Enter") onSend();
                    }}
                />
                <button onClick={onSend}>
                    Send
                </button>
            </div>
            <div className="chatWindow hPad8">
                {room && <h2>{room}</h2>}
                {room && chatMessages && chatMessages.map((i) => {
                    return < ChatBubble info={i} key={i._id} />
                })}
                {!userContext.userName && <h1>Log In!</h1>}
                {!room && userContext.userName && <h1>Select a Room to Join</h1>}
            </div>
        </div>
    </>)
}

export default ChatWindow;