import { useState, useEffect, useContext } from "react";
import axios from "axios";
import io from "socket.io-client";
import Cookies from "js-cookie";
import { useOutletContext, useNavigate } from "react-router-dom";

import ChatNav from "../components/ChatNav.js";
import ChatWindow from "../components/ChatWindow.js";
import { UserContext } from "../context/userContext.js";

const serverURL = process.env.REACT_APP_BACKEND_URL;

let socket = io(serverURL, { autoConnect: false });

let signOut = false;

function HomeChatPage() {
    const nav = useNavigate();
    const userContext = useContext(UserContext);
    const [socketLogOut, setSocketLogOut] = useOutletContext();
    const [currentRoom, setCurrentRoom] = useState();
    const [newChat, setNewChat] = useState();

    // Connect socket when logged in
    useEffect(() => {
        if (userContext.id) {
            let sID = Cookies.get('sSID');
            let auth = {
                userID: userContext.id,
                userName: userContext.userName,
                sessionID: sID
            }
            socket.connect();
            socket.emit('auth', auth);

            socket.on('loggedInElsewhere', () => {
                alert('Account logged in elsewhere');
                socket.disconnect();
                userContext.logOut();
                nav('/');
            });

            socket.on('setSession', (sSID) => {
                Cookies.set('sSID', sSID, { expires: 7 })
            });

            socket.on('notification', (info) => {
                alert("Recieved a new notification!")
            });
        }
    }, [userContext.id]);

    // Join Rooms with Socket.io
    useEffect(() => {
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
                    socket.close();
                }
            });
        }
    }, [currentRoom]);

    // Signout Socket Disconnect
    useEffect(() => {
        if (socketLogOut) {
            signOut = true;
            setSocketLogOut(false);
            socket.disconnect();
        }
        socket.on('disconnect', (reason, details) => {
            if (!signOut) {
                alert('disconnected from server!');
                signOut = false;
            }
            nav('/');
        });
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

    // Send Message Socket
    function onSendHandler(info) {
        let x = currentRoom._id
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
                message: userContext.userName + " wants to add you as a friend!"
            }

            await axios.post(
                `${serverURL}/notifications`,
                info,
                { headers: { Authorization: 'bearer ' + userContext.token } }
            ).then((res) => {
                socket.emit('sendNotification', info);
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