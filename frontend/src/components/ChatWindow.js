import { useState, useContext, useEffect } from "react";
import axios from "axios";

import { UserContext } from "../context/userContext";
import ChatBubble from "./ChatBubble";

const serverURL = process.env.REACT_APP_BACKEND_URL;


function ChatWindow({ room, onSend, update }) {
    const userContext = useContext(UserContext);
    const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState();

    // Get Messages on Load
    useEffect(() => {
        async function getChat() {
            axios.get(`${serverURL}/Messages/${room._id}`, {
                headers: { Authorization: "bearer " + userContext.token }
            }).then((res) => {
                setChatMessages(res.data);
            });
        }
        document.getElementById('messageInput').focus();

        if (userContext.id && room) getChat();
    }, [room]);

    // Send Message
    async function onSendHandler() {
        let date = new Date();

        if (message !== '') {
            const info = {
                room: room._id,
                message: message,
                sender: userContext.userName,
                date: date.toString()
            }

            try {
                await axios.post(`${serverURL}/Messages/`, info);
            } catch (err) {
                alert(err);
            }

            onSend(info);
            setMessage('');
        }

        document.getElementById('messageInput').focus();
    }

    // Update Chat
    useEffect(() => {
        if (update) {
            setChatMessages([...chatMessages, update]);
        }
    }, [update]);

    // Scroll to Bottom
    useEffect(() => {
        const element = document.getElementById("messageScroll");
        element.scrollTop = element.scrollHeight;
    }, [chatMessages]);

    // Add Friend Popup
    const [popup, setPopup] = useState(false);

    return (<>
        <div className="col-sm-12 col-md-8 col-lg-10 p-0 maxVH chatContainer">
            <div className="messageBox">
                <input
                    type="text"
                    placeholder='Message'
                    onChange={(e) => setMessage(e.target.value)}
                    value={message}
                    className="inputBar"
                    id="messageInput"
                    autoComplete="off"
                    onKeyDown={(e) => {
                        if (e.key === "Enter") onSendHandler();
                    }}
                />
                <button onClick={onSendHandler}>
                    Send
                </button>
            </div>
            <div className="chatWindow hPad8" id="messageScroll">
                {room && <h2>{room.name}</h2>}
                {room && chatMessages && chatMessages.map((i) => {
                    return < ChatBubble
                        info={i}
                        key={i._id}
                    />
                })}
                {!userContext.userName && <h1 className="centerTitle">Log In!</h1>}
                {!room && userContext.userName && <h1 className="centerTitle">Select a Conversation!</h1>}
            </div>
        </div>
    </>)
}

export default ChatWindow;