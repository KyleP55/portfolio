import { createContext, useState } from "react";

export const UserContext = createContext({
    id: null,
    token: null,
    userName: null,
    setUser: (_id, _token, _userName) => { }
});

function UserContextProvider({ children }) {
    const [id, setId] = useState(null);
    const [token, setToken] = useState(null);
    const [userName, setUserName] = useState(null);

    function setUser(_id, _token, _userName) {
        setId(_id);
        setToken(_token);
        console.log(_token)
        setUserName(_userName);
    }

    const value = {
        id: id,
        token: token,
        userName: userName,
        setUser: setUser
    }

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export default UserContextProvider;