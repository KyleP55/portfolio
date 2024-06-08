import { useState, useContext } from 'react';
import axios from 'axios';

import '../css/chatNav.css';

import CreateRoomPopUp from "../components/CreateRoomPopUp.js";
import { UserContext } from '../context/userContext.js';

const serverURL = process.env.REACT_APP_BACKEND_URL;

function ChatNav({ viewRoom, rooms }) {
    const userContext = useContext(UserContext);
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

    async function testFetch() {
        console.log(userContext.rooms)
    }

    return (<>
        {popup && <CreateRoomPopUp onCreate={createRoom} onClose={togglePopup} />}
        <div className="col-md-2 col-lg-2 chatNavContainer">
            {userContext.rooms && userContext.rooms.map((room) => {
                return <button onClick={viewRoom.bind(this, room)} key={room._id} className='chatNavButton'>
                    {room.name}
                </button>
            })}

            <button onClick={togglePopup} className="chatNavButton">
                Create Room
            </button>
            <p>List of Friends</p>
            <p>Add Friend Button</p>
            <button onClick={testFetch}>
                Clear All Messages
            </button>
        </div>
    </>)
}

export default ChatNav;