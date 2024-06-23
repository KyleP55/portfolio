import { createContext, useState } from "react";
import axios from "axios";

const serverURL = process.env.REACT_APP_BACKEND_URL;

export const UserContext = createContext({
    id: null,
    token: null,
    userName: null,
    rooms: [],
    friends: [],
    setUser: (_id, _token, _userName, _rooms, _friends) => { },
    setRooms: (rooms) => { },
    setFriends: (friends) => { },
    logOut: () => { }
});

function UserContextProvider({ children }) {
    const [id, setId] = useState(null);
    const [token, setToken] = useState(null);
    const [userName, setUserName] = useState(null);
    const [rooms, setRoomsState] = useState([]);
    const [friends, setFriendsState] = useState([]);

    async function setUser(_id, _token, _userName, _email, _rooms, _friends) {
        setId(_id);
        setToken(_token);
        setUserName(_userName);

        // Get Rooms
        try {
            await axios.get(`${serverURL}/rooms/list`, {
                headers: { Authorization: "bearer " + _token },
                params: { rooms: _rooms }
            }).then((res) => {
                //console.log('dataadadad ', res.data)
                setRoomsState([...res.data]);
            });

            await axios.get(`${serverURL}/authAccounts/friends`, {
                headers: { Authorization: "bearer " + _token },
                params: { id: _id }
            }).then((res) => {
                setFriendsState([...res.data]);
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

    function logOut() {
        setId();
        setToken();
        setUserName();
        setRoomsState();
        setFriendsState();
    }

    const value = {
        id: id,
        token: token,
        userName: userName,
        rooms: rooms,
        friends: friends,
        setUser: setUser,
        setRooms: setRooms,
        setFriends: setFriends,
        logOut: logOut
    }

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export default UserContextProvider;