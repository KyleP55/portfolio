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
    const [rooms, setRooms] = useState();
    const [friends, setFriends] = useState();
    const [currentRoom, setCurrentRoom] = useState('Global');

    useEffect(() => {
        // async function getNavStuff() {
        //     console.log(userContext.token)
        //     alert(userContext.token)
        //     axios.get(`${serverURL}/authAccounts/roomsfriends`, { headers: { authorization: "bearer " + userContext.token } })
        //         .then((res) => {
        //             console.log('should be next line')
        //             console.log(res);
        //         });
        // }
        setRooms([...userContext.rooms]);
        setFriends([...userContext.friends]);

        //if (userContext.id) getNavStuff();
        // Socket Listner
        if (currentRoom && userContext.userName) {

            //getChat();
            //socket.emit('joinRoom', room);

            socket.on('newMessage', (incRoom, incMessage) => {
                alert('got message ' + incRoom)
                if (incRoom == currentRoom) {
                    let newMessage = { ...incMessage, id: new Date().toString() }
                    console.log(incMessage)
                    //setChatMessages([...chatMessages, newMessage]);
                }

                return () => {
                    socket.disconnect();
                }
            });
        }
    }, [userContext.id]);

    // Change current room
    function changeRoom(newRoom) {
        setCurrentRoom(newRoom);
    }

    // Create Room
    async function createRoom() {
        console.log('to do')
    }

    return (<div className="container-fluid">
        <div className="row maxVH">
            <ChatNav viewRoom={changeRoom} rooms={rooms} onCreate={createRoom} friends={friends} />
            <ChatWindow room={currentRoom} />
        </div>
    </div>);
}

export default HomeChatPage;