require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const server = require('http').createServer(app);
const cors = require('cors');
const { InMemorySessionStore } = require('./functions/sessonStore.js');
const sessionStore = new InMemorySessionStore();


const frontendUrl = process.env.FRONTEND_URL || 'http://127.0.0.1:3000';
const url = process.env.DATABASE_URL || 'mongodb://127.0.0.1/localChatApp';
const port = process.env.PORT || 5000;

const accountRouter = require("./routes/accountRoutes.js");
const authCheck = require("./middleware/authCheck.js");
const authAccountRouter = require("./routes/authAccountRoutes.js");
const messageRouter = require("./routes/messageRoutes.js");
const roomRouter = require("./routes/roomRoutes.js");
const notificationRouter = require("./routes/notificationRoutes.js");

// Socket Options
const io = require('socket.io')(server, {
    cors: {
        origin: frontendUrl,
        allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    }
});

// Connect to Mongo
try {
    mongoose.connect(url);
    console.log('Connected to Database');
} catch (err) {
    console.log(err);
}

// Listen on port
server.listen(port, () => {
    console.log('Sever running on', port);
});

// IO Stuff
io.on('connection', (socket) => {
    let auth = socket.handshake.auth;
    if (auth) {
        // console.log('no auth')
        // console.log(auth);
    }

    socket.on('auth', (auth) => {
        let check = sessionStore.findSession(auth.userID)
        console.log('check')
        console.log(check)
        if (check) {
            io.emit()
            io.in(check.socketID).disconnectSockets();
            console.log('closed old socket')
        }
        sessionStore.saveSession(auth.userID,
            {
                socketID: socket.id,
                userName: auth.userName
            }
        );
    });

    socket.on('showall', () => {
        async function showAllSockets() {
            const socks = await io.fetchSockets();
            console.log('-----------------------------------------');
            let x = sessionStore.findAllSessions();
            console.log('**Socks**')
            for (const s of socks) {
                console.log(s.id)
            }
            console.log("**SessionStores**")
            x.forEach((i) => {
                console.log(i);
                console.log(sessionStore.findSession(i))
            })
        }

        showAllSockets();
    });

    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
        //console.log(`Joined ${roomId}`);
    });

    socket.on('sendMessage', (roomId, message) => {
        io.to(roomId).emit('newMessage', roomId, message);
        //console.log('sent', roomId)
    });

    socket.on('disconnect', () => {
        //console.log('should be removing', socket.id);
        let id = sessionStore.findSessionBySocketID(socket.id);
        //console.log('found', id)
        sessionStore.deleteSession(id);
    });
});

// Middleware / Routes
app.use(express.json());

const corsOptions = {
    origin: frontendUrl,
    allowedHeaders: ['Access-Control-Allow-Headers', 'Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    preflightContinue: false
}
app.use(cors(corsOptions));

app.use('/accounts', accountRouter);
app.use(authCheck);
app.use('/messages', messageRouter);
app.use('/rooms', roomRouter);
app.use('/authAccounts', authAccountRouter);
app.use('/notifications', notificationRouter);
