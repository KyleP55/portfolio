import { useState, useEffect, useContext } from "react";
import axios from "axios";
import io from "socket.io-client";

import ChatNav from "../components/ChatNav.js";
import ChatWindow from "../components/ChatWindow.js";
import { UserContext } from "../context/userContext.js";

const serverURL = process.env.REACT_APP_BACKEND_URL;
const socket = io(serverURL);

function HomeChatPage() {
    const userContext = useContext(UserContext);
    const [currentRoom, setCurrentRoom] = useState();
    const [newChat, setNewChat] = useState();

    useEffect(() => {
        // Socket Listner
        if (userContext.rooms) {
            userContext.rooms.forEach((room) => {
                socket.emit('joinRoom', room._id);
            });
        }
    }, [userContext.rooms]);

    useEffect(() => {
        if (currentRoom) {
            console.log('id', currentRoom._id)
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

    return (<div className="container-fluid">
        <div className="row maxVH">
            <ChatNav
                viewRoom={changeRoom}
                rooms={userContext.rooms}
                onCreate={createRoom}
                friends={userContext.friends}
            />
            <ChatWindow
                room={currentRoom}
                onSend={onSendHandler}
                update={newChat}
            />
        </div>
    </div>);
}

export default HomeChatPage;