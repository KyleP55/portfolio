

import ChatNav from "../components/ChatNav.js";
import ChatBubble from "../components/ChatBubble.js";
import ChatWindow from "../components/ChatWindow.js";


function HomeChatPage() {

    return (<div className="container-fluid">
        <div className="row maxVH">
            <ChatNav />
            <ChatWindow />
        </div>
    </div>);
}

export default HomeChatPage;