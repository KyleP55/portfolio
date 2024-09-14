import { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { socket } from "../util/socket.js";
import { useOutletContext, useNavigate } from "react-router-dom";

import ChatNav from "../components/ChatNav.js";
import ChatWindow from "../components/ChatWindow.js";
import { UserContext } from "../context/userContext.js";

const serverURL = process.env.REACT_APP_BACKEND_URL;

function HomeChatPage() {
    const nav = useNavigate();
    const userContext = useContext(UserContext);
    const [socketConnect, setSocketConnect] = useState(false);
    const [currentRoom, setCurrentRoom] = useState();
    const [newChat, setNewChat] = useState();

    function authSocket() {
        let sID = Cookies.get('sSID');
        let auth = {
            userID: userContext.id,
            userName: userContext.userName,
            sessionID: sID
        }
        socket.emit('auth', auth);
    }

    // Connect socket when logged in
    useEffect(() => {
            //authSocket();

            // Connection Error
            socket.on('connect_error', (err) => {
                alert(err.message)
            });
            // Logged In Elsewhere
            socket.on('loggedInElsewhere', () => {
                alert('Account logged in elsewhere');
                socket.disconnect();
                userContext.logOut();
                nav('/');
            });

            // Set Session Cookie
            socket.on('setSession', (sSID) => {
                Cookies.set('sSID', sSID, { expires: 7 });
            });

            // Update Friends
            socket.on('updateFriendsTrigger', () => {
                try {
                    async function getFriends() {
                        await axios.get(
                            `${serverURL}/authAccounts/friends`,
                            {
                                headers: { Authorization: "bearer " + userContext.token },
                                params: { id: userContext.id }
                            }
                        ).then((res) => {
                            console.log(res)
                            userContext.setFriends([...res.data]);
                        });
                    }

                    getFriends();
                } catch (err) {
                    console.log(err.message);
                }
            });

            // Friend Online/Offline
            socket.on('joined', (userId) => {
                console.log('joined trigger')
                userContext.setFriendsOnline(userId, true);
            });

            // socket.on('leftRoom', (userId) => {
            //     userContext.setFriendsOnline(userId, false);
            // });

            // On Notification
            socket.on('notification', (info) => {
                alert('notification')
                try {
                    axios.get(
                        `${serverURL}/notifications/${userContext.id}`,
                        { headers: { Authorization: "bearer " + userContext.token } }
                    ).then((res) => {
                        userContext.setNotifications([...res.data]);


                    })
                } catch (err) {
                    console.log(err.message)
                }
            });

            socket.on('newMessage', (incRoom, incMessage) => {
                let curRoom = null;
                setCurrentRoom(prev => {
                    curRoom = prev
                    console.log('curPrev:', prev)
                })
                if (incRoom === currentRoom._id) {
                    let newMessage = { ...incMessage, _id: new Date().toString() }

                    setNewChat(newMessage);
                }

                return () => {
                    socket.close();
                }
            });

            // Room was deleted
            socket.on('roomRemoved', (roomId) => {
                let newArr = null;
                userContext.setRooms(prev => console.log(prev))
                userContext.rooms.forEach((r, i) => {
                    if (r._id === roomId) newArr.splice(i, 1);
                });
                userContext.setRooms([...newArr]);

                let curRoom = null;
                setCurrentRoom(prev => curRoom = prev);
    
                if (curRoom && curRoom._id === roomId) setCurrentRoom();
            });

            // On Disconnect
            socket.on('disconnect', (reason, details) => {
                if (socket.active) {
                    let answer = window.confirm("Disconnected from server, Reconnect? \n\n Reason: " + reason);
                    if (answer) {
                        socket.connect();
                        setSocketConnect(true);
                        authSocket();
                        return;
                    }
                }
                userContext.logOut();
                nav('/');
            });
    }, []);

    // Join Rooms with Socket.io
    useEffect(() => {
        if (userContext.rooms.length > 0 && socketConnect) {
            userContext.rooms.forEach((room) => {
                alert('rooms:', room)
                socket.emit('joinRoom', room._id);
            });
        }

        if (userContext.friends.length > 0 && socketConnect) {
            userContext.friends.forEach((friend) => {
                socket.emit('joinRoom', friend._id);
                socket.emit('checkOnline', friend._id);
            });
        }
        setSocketConnect(false);
    }, [userContext.rooms, userContext.friends, socketConnect]);

    // Change current room
    function changeRoom(newRoom) {
        console.log(newRoom)
        setCurrentRoom(newRoom);
    }

    // Create Room
    async function createRoom(info) {
        try {
            let token = { headers: { Authentication: 'bearer: ' + userContext.token } }

            await axios.post(
                `${serverURL}/rooms/`,
                info,
                token
            ).then((res) => {
                console.log(res);
            })
        } catch (err) {
            console.log(err.message)
        }
    }

    // Send Message Socket
    function onSendHandler(info) {
        let x = currentRoom._id;
        socket.emit('sendMessage', x, info);
    }

    function socketTest() {
        socket.emit('showall');
    }

    // Friend Request
    async function onFriendRequest(name) {
        // Check if target is friend already
        let friendExists = false;
        userContext.friends.forEach((i) => {
            if (i.userName === name) {
                alert(`${name} is already your friend!`);
                friendExists = true;
            }
        });
        if (friendExists == false) {
            try {
                let info = {
                    target: name,
                    type: 'Friend Request',
                    from: userContext.id,
                    message: userContext.userName + " wants to add you as a friend!"
                }

                await axios.post(
                    `${serverURL}/notifications`,
                    info,
                    { headers: { Authorization: 'bearer ' + userContext.token } }
                ).then((res) => {
                    alert('should be sent')
                    socket.emit('sendNotification', info);
                })
            } catch (err) {
                console.log(err.message)
            }
        }
    }

    return (<div className="container-fluid maxVH">
        <div className="row maxVH">
            <ChatNav
                viewRoom={changeRoom}
                onCreate={createRoom}
                friends={userContext.friends}
                socketTest={socketTest}
            />
            <ChatWindow
                room={currentRoom}
                onSend={onSendHandler}
                update={newChat}
                sendFriendRequest={onFriendRequest}
            />
        </div>
    </div>);
}

export default HomeChatPage;