import { useState, useContext, useEffect } from "react";
import axios from "axios";

import { UserContext } from "../context/userContext";
import ChatBubble from "./ChatBubble";

const serverURL = process.env.REACT_APP_BACKEND_URL;

let oldHeight = window.innerHeight;

function ChatWindow({ room, onSend, update, sendFriendRequest }) {
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
                await axios.post(
                    `${serverURL}/Messages/`,
                    info,
                    {
                        headers: {
                            Authorization: "bearer " + userContext.token
                        }
                    }
                );
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

    // Scroll to Bottom on new chat
    useEffect(() => {
        const element = document.getElementById("messageScroll");
        element.scrollTop = element.scrollHeight;
    }, [chatMessages]);

    window.addEventListener("resize", (e) => { 
        let diff = oldHeight - window.innerHeight;
        oldHeight = window.innerHeight;

        const element = document.getElementById("messageScroll");
        if (element) element.scrollTop = element.scrollTop + diff;
      }); 

    // Disable message input untill room is selected
    useEffect(() => {
        const element = document.getElementById("messageInput");
        if (room) {
            element.removeAttribute("disabled");
        } else {
            element.setAttribute("disabled", "disabled");
        }
    }, [room]);

    return (<>
        <div className="col-xs-12 col-sm-7 col-md-8 col-lg-9 p-0 maxVH chatContainer">
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
                    disabled
                />
                <button onClick={onSendHandler}>
                    Send
                </button>
            </div>
            <div className="chatWindow hPad8" id="messageScroll">
                {room && 
                    <div className="headerBar">
                        <h2>{room.name}</h2>
                    </div>
                }
                {room && chatMessages && chatMessages.map((i) => {
                    return < ChatBubble
                        info={i}
                        key={i._id}
                        sendFriendRequest={sendFriendRequest}
                    />
                })}
                {!userContext.userName && <h1 className="centerTitle">Log In!</h1>}
                {!room && userContext.userName && <h1 className="centerTitle">Select a Conversation!</h1>}
            </div>
        </div>
    </>)
}

export default ChatWindow;