import { useState, useEffect, useContext } from "react";
import axios from "axios";
import io from "socket.io-client";
import Cookies from "js-cookie";
import { useOutletContext } from "react-router-dom";

import ChatNav from "../components/ChatNav.js";
import ChatWindow from "../components/ChatWindow.js";
import { UserContext } from "../context/userContext.js";

const serverURL = process.env.REACT_APP_BACKEND_URL;

let socket = null;

function HomeChatPage() {
    const userContext = useContext(UserContext);
    const [socketLogOut, setSocketLogOut] = useOutletContext();
    const [currentRoom, setCurrentRoom] = useState();
    const [newChat, setNewChat] = useState();

    useEffect(() => {
        if (userContext.id) {
            let auth = {
                userID: userContext.id,
                userName: userContext.userName
            }

            socket = io(serverURL);
            socket.emit('auth', auth);
            socket.on('disconnect', () => {
                alert('disconnected from server!')
            })
        }
    }, [userContext.id]);

    useEffect(() => {
        // Join Rooms with Socket.io
        if (userContext.rooms) {
            userContext.rooms.forEach((room) => {
                socket.emit('joinRoom', room._id);
            });
        }
    }, [userContext.rooms]);

    // Update message if room = socket
    useEffect(() => {
        if (currentRoom) {
            socket.on('newMessage', (incRoom, incMessage) => {
                if (incRoom === currentRoom._id) {
                    let newMessage = { ...incMessage, _id: new Date().toString() }

                    setNewChat(newMessage);
                }

                return () => {
                    socket.disconnect();
                }
            });
        }
    }, [currentRoom]);

    useEffect(() => {
        if (socketLogOut) socket.disconnect();
    }, [socketLogOut]);

    // Change current room
    function changeRoom(newRoom) {
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

    // Send Socket
    function onSendHandler(info) {
        let x = currentRoom._id
        console.log('current', x)
        socket.emit('sendMessage', x, info);
    }

    function socketTest() {
        socket.emit('showall');
    }

    // Friend Request
    async function onFriendRequest(name) {
        try {
            let info = {
                target: name,
                type: 'Friend Request',
                from: userContext.id
            }

            await axios.post(
                `${serverURL}/notifications/`,
                info,
                { headers: { Authorization: 'bearer ' + userContext.token } }
            ).then((res) => {
                if (res.status === "OK") {
                    //socket.emit('notification', )
                }
            })
        } catch (err) {
            console.log(err.message)
        }
    }

    return (<div className="container-fluid">
        <div className="row maxVH">
            <ChatNav
                viewRoom={changeRoom}
                rooms={userContext.rooms}
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