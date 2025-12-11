import { io } from "socket.io-client";

const serverURL = process.env.REACT_APP_IO_URL;

export const socket = io(serverURL,
    {
        autoConnect: false,
        withCredentials: true,
        transports: ["websocket", "polling"]
    });