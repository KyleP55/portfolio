const crypto = require('crypto');
const randomId = () => crypto.randomBytes(8).toString("hex");

module.exports = function setupSockets(io, sessionStore) {
    io.on('connection', (socket) => {
        console.log('connected');

        socket.on('auth', (auth) => {
            let check = sessionStore.findSession(auth.userID);
            let sSID = auth.sessionID;

            if (check) {
                if (sSID !== check.sessionID) {
                    io.in(check.socketID).emit('loggedInElsewhere');
                    sSID = randomId();
                }
            } else {
                if (!sSID) sSID = randomId();
            }

            sessionStore.saveSession(auth.userID, {
                socketID: socket.id,
                userName: auth.userName,
                sessionID: sSID
            });

            io.to(socket.id).emit('setSession', sSID);
        });

        socket.on('showall', async () => {
            const socks = await io.fetchSockets();
            console.log('-----------------------------------------');
            console.log('**Socks**');
            socks.forEach(s => console.log(s.id));
        });

        io.to(socket.id).emit('joinRooms');

        socket.on('joinRoom', (roomId) => {
            socket.join(roomId);
            const userId = sessionStore.findSessionBySocketID(socket.id);
            io.to(roomId).emit('joined', userId);
        });

        socket.on('checkOnline', async (roomId) => {
            const socks = await io.in(roomId).fetchSockets();
            socks.forEach((i) => {
                if (i.id != socket.id) {
                    const friendId = sessionStore.findSessionBySocketID(i.id);
                    io.to(roomId).emit('joined', friendId);
                }
            });
        });

        socket.on('leaveRoom', (roomId) => {
            socket.leave(roomId);
            console.log(socket.id, 'left room', roomId);
        });

        socket.on('removeRoom', (roomId) => {
            io.to(roomId).emit('roomRemoved', roomId);
            io.socketsLeave(roomId);
        });

        socket.on('sendMessage', (roomId, message) => {
            io.to(roomId).emit('newMessage', roomId, message);
        });

        socket.on('sendNotification', (info) => {
            const targetID = sessionStore.findSessionByName(info.target);
            if (targetID) io.to(targetID.socketID).emit('notification', info);
        });

        socket.on('updateFriends', (id) => {
            const targetID = sessionStore.findSession(id);
            if (targetID) io.to(targetID.socketID).emit('updateFriendsTrigger');
        });

        socket.on('disconnecting', () => {
            console.log('Disconnecting');
            for (const x of socket.rooms) {
                if (x != socket.id) {
                    const userId = sessionStore.findSessionBySocketID(socket.id);
                    io.to(x).emit('leftRoom', userId);
                    console.log('leaving ' + x);
                }
            }
        });

        socket.on('disconnect', () => {
            let id = sessionStore.findSessionBySocketID(socket.id);
            sessionStore.deleteSession(id);
            console.log('disconnected');
        });
    });
};
