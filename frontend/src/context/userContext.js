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
    setFriends: (friends) => { }
});

function UserContextProvider({ children }) {
    const [id, setId] = useState(null);
    const [token, setToken] = useState(null);
    const [userName, setUserName] = useState(null);
    const [rooms, setRoomsState] = useState([]);
    const [friends, setFriendsState] = useState([]);

    async function setUser(_id, _token, _userName, _rooms, _friends) {
        setId(_id);
        setToken(_token);
        setUserName(_userName);

        // Get Rooms
        let roomsInfo = [];
        // await axios.get(`${serverURL}/rooms/list`, { message: "hi" }, { headers: { Authorization: "bearer " + _token } })
        //     .then((res) => {
        //         let x = res.data;
        //         let info = {
        //             name: x.name,
        //             id: x.id,
        //             visability: x.visability
        //         }

        //         roomsInfo.push(info);
        //     });

        setRoomsState([]);

        let friendsInfo = []
        console.log('friends', _friends)
        // await axios.get('rooms/list', _rooms)
        //     .then((res) => {
        //         let x = res.data;
        //         let info = {
        //             name: x.name,
        //             id: x.id,
        //             visability: x.visability
        //         }

        //         roomsInfo.push(info);
        //     });

        setFriendsState([]);
    }

    function setRooms(rooms) {
        setRoomsState([...rooms]);
    }

    function setFriends(friends) {
        setFriendsState([...friends]);
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
    }

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export default UserContextProvider;