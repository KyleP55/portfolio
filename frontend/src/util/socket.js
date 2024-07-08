import { io } from "socket.io-client";

const serverURL = process.env.REACT_APP_BACKEND_URL;

export const socket = io(serverURL, { autoConnect: false });