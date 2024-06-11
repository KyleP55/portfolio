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

    // Toggle Mobile Nav

    async function testFetch() {
        console.log(userContext.rooms)
    }

    return (<>
        {popup && <CreateRoomPopUp onCreate={createRoom} onClose={togglePopup} />}
        <div className="col-md-4 col-lg-2 sideNav chatNavContainer">
            <p className="navTitle">Your Rooms</p>
            <div className="roomsDiv">
                {userContext.rooms && userContext.rooms.map((room) => {
                    return <button onClick={viewRoom.bind(this, room)} key={room._id} className='chatNavButton'>
                        {room.name}
                    </button>
                })}
            </div>
            <button onClick={togglePopup} className="chatNavButton">
                Create Room
            </button>

            <p className="navTitle">Your Friends</p>
            <div className="roomsDiv">
                {userContext.friends && userContext.friends.map((friend) => {
                    return <button onClick={console.log('friend')} key={friend._id} className='chatNavButton'>
                        {friend.name}
                    </button>
                })}
            </div>
            <button onClick={togglePopup} className="chatNavButton">
                Add Friend
            </button>

            <button onClick={testFetch}>
                Clear All Messages
            </button>
        </div>
    </>)
}

export default ChatNav;