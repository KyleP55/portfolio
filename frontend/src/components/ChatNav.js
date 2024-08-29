import { useState, useContext } from 'react';
import axios from 'axios';

import '../css/chatNav.css';

import CreateRoomPopUp from "../components/CreateRoomPopUp.js";
import SearchPopUp from "../components/SearchPopUp.js";
import RoomButton from './RoomButton.js';
import { UserContext } from '../context/userContext.js';
import { socket } from '../util/socket.js';

import menuIcon from '../images/menuIcon.png';
import dotsIcon from '../images/dotsIcon.png';
import FriendButton from './FriendButton.js';

const serverURL = process.env.REACT_APP_BACKEND_URL;

let navShow = false;

function ChatNav({ viewRoom, rooms, socketTest }) {
    const userContext = useContext(UserContext);
    const [popup, setPopup] = useState(false);
    const [findPopup, setFindPopup] = useState(false);
    const [roomType, setRoomType] = useState(true);

    // Toggles
    function togglePopup() {
        if (popup) setPopup(false); else setPopup(true);
        if (findPopup) setFindPopup(false);
    }

    function toggleRoomPopup(isRoom) {
        if (isRoom) setRoomType(isRoom);
        if (findPopup) setFindPopup(false); else setFindPopup(true);
        if (popup) setPopup(false);
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
                userContext.setRooms([...userContext.rooms, res.data]);
                socket.emit('joinRoom', res.data._id);
                setPopup(false);
            })
        } catch (err) {
            console.log(err.message);
        }
    }

    // Toggle Mobile Nav
    function toggleMobileNav() {
        let navList = document.getElementById("sideNavList");
        let button = document.getElementById("chatNavButton");
        if (navShow) {
            navList.style.width = "0%";
            button.style.left = "0%";
        } else {
            navList.style.width = "85%";
            button.style.left = "85%";
        }

        navShow = !navShow;
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
                    // Leave Rooms
                    if (room.owner === userContext.id) {
                        // If you own room
                        axios.delete(
                            `${serverURL}/rooms/${room._id}`,
                            { headers: { Authorization: `bearer ${userContext.token}` } }
                        ).then((res) => {
                            let newArr = [...userContext.rooms];

                            newArr.forEach((r, i) => {
                                if (r._id === room._id) {
                                    newArr.splice(i, 1);
                                }
                            });

                            userContext.setRooms([...newArr]);
                            socket.emit('removeRoom', room._id);
                        });
                    } else {
                        // If you do not own room
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
                            socket.emit('leaveRoom', room._id);
                        });
                    }
                }
                viewRoom();
            } catch (err) {
                console.log(err.message);
            }
        }
    }

    return (<>
        {popup && <CreateRoomPopUp onCreate={createRoom} onClose={togglePopup} />}
        {findPopup && <SearchPopUp isRoom={roomType} onClose={toggleRoomPopup} />}

        <div className="col-md-4 col-lg-2 sideNav chatNavContainer maxVH" id="sideNavList">
            <p className="navTitle">Your Rooms</p>
            <div className="roomsDiv">
                {userContext.rooms && userContext.rooms.map((room, i) => {
                    return <RoomButton
                        info={room}
                        viewRoom={viewRoom}
                        removeRoom={removeRoom}
                        key={room._id}
                        n={i}
                    />
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
                {userContext.friends && userContext.friends.map((friend, i) => {
                    return <FriendButton
                        friend={friend}
                        status={friend.online}
                        viewRoom={viewRoom}
                        removeRoom={removeRoom}
                        key={i}
                    />
                })}
            </div>
            <button onClick={toggleRoomPopup.bind(this, false)} className="chatNavButton">
                Add Friend
            </button>
        </div>
        <div className="mobileChatNavButton" id="chatNavButton" onClick={toggleMobileNav}>
            <img src={menuIcon} width="32px" />
        </div>
    </>);
};

export default ChatNav;