import '../css/chatNav.css';

function ChatNav({ viewRoom }) {

    return (<>
        <div className="col-md-2 col-lg-2 chatNavContainer">
            <button onClick={viewRoom.bind(this, "Global")}>
                Global Chat
            </button>
            <p>List of Friends</p>
            <p>Add Friend Button</p>
        </div>
    </>)
}

export default ChatNav;