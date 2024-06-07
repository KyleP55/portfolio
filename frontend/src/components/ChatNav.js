import { useState } from 'react';
import axios from 'axios';

import '../css/chatNav.css';

import CreateRoomPopUp from "../components/CreateRoomPopUp.js";
import Cookies from 'js-cookie';

const serverURL = process.env.REACT_APP_BACKEND_URL;

function ChatNav({ viewRoom, rooms, friends }) {
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
        // Get Rooms
        let token = Cookies.get('token');
        let roomsInfo = [];
        await axios.get(`${serverURL}/rooms/list`, { message: "hi" }, { headers: { Authorization: "bearer " + token } })
            .then((res) => {
                let x = res.data;
                let info = {
                    name: x.name,
                    id: x.id,
                    visability: x.visability
                }

                roomsInfo.push(info);
            });
    }

    return (<>
        {popup && <CreateRoomPopUp onCreate={createRoom} onClose={togglePopup} />}
        <div className="col-md-2 col-lg-2 chatNavContainer">
            {rooms && rooms.map((room) => {
                <button onClick={viewRoom.bind(this, room.id)} key={room.id}>
                    {room.name}
                </button>
            })}

            <button onClick={togglePopup}>
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