import { useState, useContext } from 'react';
import axios from 'axios';

import '../css/chatNav.css';

import CreateRoomPopUp from "../components/CreateRoomPopUp.js";
import SearchPopUp from "../components/SearchPopUp.js";
import { UserContext } from '../context/userContext.js';

import menuIcon from '../images/menuIcon.png';
import dotsIcon from '../images/dotsIcon.png';

const serverURL = process.env.REACT_APP_BACKEND_URL;

function ChatNav({ viewRoom, rooms, socketTest }) {
    const userContext = useContext(UserContext);
    const [popup, setPopup] = useState(false);
    const [findPopup, setFindPopup] = useState(false);
    const [roomType, setRoomType] = useState(true);

    // Clear Messages ** Delete Later **
    async function clearDB() {
        axios.delete(`${serverURL}/messages/`)
            .then(() => {
                alert('should be deleted');
            });
    }

    // Toggles
    function togglePopup() {
        if (popup) setPopup(false); else setPopup(true);
    }

    function toggleRoomPopup(isRoom) {
        if (isRoom) setRoomType(isRoom);
        if (findPopup) setFindPopup(false); else setFindPopup(true);
    }

    // Create Room
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
            str = "Remove Friend " + room.userName + "?";
        } else {
            str = "Leave Room " + room.name + "?"
        }
        let answer = window.confirm(str);
        if (answer) {
            try {
                // If removing friend, delete private room and update
                if (type === 'friend') {
                    axios.delete(
                        `${serverURL}/rooms/${room._id}`,
                        { headers: { Authorization: `bearer ${userContext.token}` } }
                    );

                    let newList = [...userContext.friends];
                    userContext.friends.forEach((friend, i) => {
                        if (friend._id === room._id) {
                            newList.splice(i, 1);
                        }
                    });

                    userContext.setFriends([...newList]);
                } else {
                    axios.delete(
                        `${serverURL}/authAccounts/leaveRoom/${room._id}`,
                        { headers: { Authorization: `bearer ${userContext.token}` } }
                    ).then((res) => {
                        let newArr = [...userContext.rooms];

                        newArr.forEach((r, i) => {
                            if (r._id === room._id) {
                                newArr.splice(i, 1);
                            }
                        });

                        userContext.setRooms([...newArr]);
                    });
                }
            } catch (err) {
                console.log(err.message);
            }
        }
    }

    return (<>
        {popup && <CreateRoomPopUp onCreate={createRoom} onClose={togglePopup} />}
        {findPopup && <SearchPopUp isRoom={roomType} onClose={toggleRoomPopup} />}

        <div className="col-md-4 col-lg-2 sideNav chatNavContainer">
            <p className="navTitle">Your Rooms</p>
            <div className="roomsDiv">

                {userContext.rooms && userContext.rooms.map((room) => {
                    return <button onClick={viewRoom.bind(this, room)} key={room._id} className='chatNavButton'>
                        {room.name}
                        <div onClick={(e) => {
                            e.stopPropagation();
                            removeRoom(room, 'room');
                        }}>
                            <img src={dotsIcon} className="dotsIcon" width="30px" />
                        </div>
                    </button>
                })}
            </div>
            <button onClick={toggleRoomPopup.bind(this, true)} className="chatNavButton">
                Find Rooms
            </button>
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
            <button onClick={toggleRoomPopup.bind(this, false)} className="chatNavButton">
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