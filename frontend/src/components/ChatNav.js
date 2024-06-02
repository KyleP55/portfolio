import { useState } from 'react';
import axios from 'axios';

import '../css/chatNav.css';

import CreateRoomPopUp from "../components/CreateRoomPopUp.js";

const serverURL = process.env.REACT_APP_BACKEND_URL;

function ChatNav({ viewRoom }) {
    const [popup, setPopup] = useState(false);

    // Clear Messages ** Delete Later **
    async function clearDB() {
        axios.delete(`${serverURL}/messages/`)
            .then(() => {
                alert('should be deleted');
            });
    }

    // Toggle
    function togglePopup() {
        if (popup) setPopup(false); else setPopup(true);
    }

    // pop up
    async function createRoom(name, visability) {
        alert("Creat room " + name + " " + visability)
    }

    return (<>
        {popup && <CreateRoomPopUp onCreate={createRoom} onClose={togglePopup} />}
        <div className="col-md-2 col-lg-2 chatNavContainer">
            <button onClick={viewRoom.bind(this, "Global")}>
                Global Chat
            </button>
            <button onClick={viewRoom.bind(this, "Private Room")}>
                Private Room
            </button>
            <button onClick={togglePopup}>
                Create Room
            </button>
            <p>List of Friends</p>
            <p>Add Friend Button</p>
            <button onClick={clearDB}>
                Clear All Messages
            </button>
        </div>
    </>)
}

export default ChatNav;