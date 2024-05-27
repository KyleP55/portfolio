import { useState } from "react";

import ChatBubble from "./ChatBubble";

let dummyData = [
    {
        _id: 1,
        sender: 'Other1',
        message: "This is a test message for my chat app",
    },
    {
        _id: 2,
        sender: 'Other2',
        message: "Something different to change it up",
    },
    {
        _id: 3,
        sender: 'You',
        message: "MY message to show a different design from the others",
    }, {
        _id: 4,
        sender: 'Other1',
        message: "Person 1 replying to my message",
    },
    {
        _id: 5,
        sender: 'Other2',
        message: "Something different to change it up",
    },
    {
        _id: 6,
        sender: 'You',
        message: "MY message to show a different design from the others",
    }, {
        _id: 7,
        sender: 'Other1',
        message: "Person 1 replying to my message",
    }
]

function ChatWindow() {
    const [message, setMessage] = useState('');

    return (<>
        <div className="col-md-10 col-lg-10 p-0 maxVH chatContainer">
            <div className="messageBox">
                <input
                    type="text"
                    placeholder='Message'
                    onChange={(e) => setMessage(e.target.value)}
                    value={message}
                    className="inputBar"
                />
                <button>Send</button>
            </div>
            <div className="chatWindow hPad8">
                {dummyData.map((i) => {
                    return < ChatBubble info={i} key={i._id} />
                })}
            </div>
        </div>
    </>)
}

export default ChatWindow;