import { useState } from "react";

import ChatNav from "../components/ChatNav.js";
import ChatBubble from "../components/ChatBubble.js";
import ChatWindow from "../components/ChatWindow.js";


function HomeChatPage() {
    const [room, setRoom] = useState('Global');

    function changeRoom(newRoom) {
        setRoom(newRoom);
    }

    return (<div className="container-fluid">
        <div className="row maxVH">
            <ChatNav viewRoom={changeRoom} />
            <ChatWindow room={room} />
        </div>
    </div>);
}

export default HomeChatPage;