import "../css/chatWindow.css";

function ChatBubble({ info }) {

    if (info.sender === "You") {
        return (<>
            <div className="bubbleContainerYou padding16">
                <p className="messageText">{info.message}</p>
                <p className="senderText">{info.sender}</p>
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