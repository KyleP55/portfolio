import { useState, useContext } from 'react';
import axios from 'axios';

import '../css/chatNav.css';

import CreateRoomPopUp from "../components/CreateRoomPopUp.js";
import { UserContext } from '../context/userContext.js';

import menuIcon from '../images/menuIcon.png';
import dotsIcon from '../images/dotsIcon.png';

const serverURL = process.env.REACT_APP_BACKEND_URL;

function ChatNav({ viewRoom, rooms, socketTest }) {
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
        let newRoom = {
            name: name,
            public: visability,
            group: true,
            owner: userContext.id
        }
        try {
            await axios.post(
                `${serverURL}/rooms/`,
                newRoom,
                { headers: { Authorization: `bearer ${userContext.token}` } }
            ).then((res) => {
                alert('Created Room')
            })
        } catch (err) {
            console.log(err.message);
        }
    }

    // Toggle Mobile Nav
    function toggleMobileNav() {

    }

    // Remove Room/Friend
    function removeRoom(room, type) {
        let str;
        if (type === 'friend') {
            str = "Leave Room " + room.userName + "?";
        } else {
            str = "Leave Room " + room.name + "?"
        }
        let answer = window.confirm(str);
        if (answer) {
            try {
                axios.delete(
                    `${serverURL}/rooms/${room._id}`,
                    { headers: { Authorization: `bearer ${userContext.token}` } }
                );
            } catch (err) {
                console.log(err.message);
            }
        }
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
                    return <div onClick={viewRoom.bind(this, friend)} key={friend._id} className='chatNavButton'>
                        {friend.userName}
                        <div onClick={(e) => {
                            e.stopPropagation();
                            removeRoom(friend, 'friend');
                        }}>
                            <img src={dotsIcon} className="dotsIcon" width="30px" />
                        </div>
                    </div>
                })}
            </div>
            <button onClick={togglePopup} className="chatNavButton">
                Add Friend
            </button>

            <button onClick={socketTest}>
                Clear All Messages
            </button>
        </div>
        <div className="mobileChatNavButton">
            <img src={menuIcon} width="32px" />
        </div>
    </>);
};

export default ChatNav;