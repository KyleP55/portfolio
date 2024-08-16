import { createContext, useState } from "react";
import axios from "axios";
import { socket } from "../util/socket";
import Cookies from "js-cookie";

const serverURL = process.env.REACT_APP_BACKEND_URL;

export const UserContext = createContext({
    id: null,
    token: null,
    userName: null,
    rooms: [],
    friends: [],
    notifications: [],
    friendsOnline: [],
    setUser: (_id, _token, _userName, _rooms, _friends) => { },
    setRooms: (rooms) => { },
    setFriends: (friends) => { },
    setNotifications: (newNotification) => { },
    setFriendsOnline: (id, staus) => { },
    logOut: () => { }
});

function UserContextProvider({ children }) {
    const [id, setId] = useState(null);
    const [token, setToken] = useState(null);
    const [userName, setUserName] = useState(null);
    const [rooms, setRoomsState] = useState([]);
    const [friends, setFriendsState] = useState([]);
    const [friendsOnline, setFriendsOnlineState] = useState([]);
    const [notifications, setNotificationsState] = useState([]);

    async function setUser(_id, _token, _userName, _email, _rooms, _friends) {
        setId(_id);
        setToken(_token);
        setUserName(_userName);


        let sID = Cookies.get('sSID');
        let auth = {
            userID: _id,
            userName: _userName,
            sessionID: sID
        }

        socket.connect();
        socket.emit('auth', auth);

        try {
            // Get Rooms
            await axios.get(`${serverURL}/rooms/list`, {
                headers: { Authorization: "bearer " + _token },
                params: { rooms: _rooms }
            }).then((res) => {
                res.data.forEach((room) => {
                    socket.emit('joinRoom', room._id);
                });
                setRoomsState([...res.data]);
            });

            // Get Friends
            await axios.get(
                `${serverURL}/authAccounts/friends`,
                {
                    headers: { Authorization: "bearer " + _token },
                    params: { id: _id }
                }
            ).then((res) => {
                res.data.forEach((friend) => {
                    friend.online = false;
                    socket.emit('joinRoom', friend._id);
                    socket.emit('checkOnline', friend._id);
                });
                setFriendsState([...res.data]);
            });

            // Get Notifications
            await axios.get(`${serverURL}/notifications/${_id}`, {
                headers: { Authorization: "bearer " + _token }
            }).then((res) => {
                setNotificationsState([...res.data]);
            });


        } catch (err) {
            console.log(err.message)
        }
    }

    function setRooms(rooms) {
        setRoomsState([...rooms]);
    }

    function setFriends(friends) {
        setFriendsState([...friends]);
    }

    function setNotifications(newNotification) {
        setNotificationsState([...newNotification]);
    }

    function setFriendsOnline(id, status) {
        let arr = [...friends];
        arr.forEach((f, i) => {
            console.log('matching ' + f[0] + ' to ' + id)
            if (f.friendID === id) {
                arr[i].online = status;
            }
        });

        setFriendsState([...friends])
    }

    function logOut() {
        setId();
        setToken();
        setUserName();
        setRoomsState([]);
        setFriendsState([]);
        setNotificationsState([]);
        setFriendsOnlineState([]);
    }

    const value = {
        id: id,
        token: token,
        userName: userName,
        rooms: rooms,
        friends: friends,
        notifications: notifications,
        friendsOnline: friendsOnline,
        setUser: setUser,
        setRooms: setRooms,
        setFriends: setFriends,
        setNotifications: setNotifications,
        setFriendsOnline: setFriendsOnline,
        logOut: logOut
    }

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export default UserContextProvider;