import { createContext, useState } from "react";
import axios from "axios";

const serverURL = process.env.REACT_APP_BACKEND_URL;

export const UserContext = createContext({
    id: null,
    token: null,
    userName: null,
    rooms: [],
    friends: [],
    notifications: [],
    setUser: (_id, _token, _userName, _rooms, _friends) => { },
    setRooms: (rooms) => { },
    setFriends: (friends) => { },
    setNotifications: (newNotification) => { },
    logOut: () => { }
});

function UserContextProvider({ children }) {
    const [id, setId] = useState(null);
    const [token, setToken] = useState(null);
    const [userName, setUserName] = useState(null);
    const [rooms, setRoomsState] = useState([]);
    const [friends, setFriendsState] = useState([]);
    const [notifications, setNotificationsState] = useState([]);

    async function setUser(_id, _token, _userName, _email, _rooms, _friends) {
        setId(_id);
        setToken(_token);
        setUserName(_userName);

        try {
            // Get Rooms
            await axios.get(`${serverURL}/rooms/list`, {
                headers: { Authorization: "bearer " + _token },
                params: { rooms: _rooms }
            }).then((res) => {
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
                console.log(res.data)
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

    function logOut() {
        setId();
        setToken();
        setUserName();
        setRoomsState();
        setFriendsState();
        setNotificationsState();
    }

    const value = {
        id: id,
        token: token,
        userName: userName,
        rooms: rooms,
        friends: friends,
        notifications: notifications,
        setUser: setUser,
        setRooms: setRooms,
        setFriends: setFriends,
        setNotifications: setNotifications,
        logOut: logOut
    }

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export default UserContextProvider;