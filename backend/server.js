require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const server = require('http').createServer(app);
const cors = require('cors');


const frontendUrl = process.env.FRONTEND_URL || 'http://127.0.0.1:3000';
const url = process.env.DATABASE_URL || 'mongodb://127.0.0.1/localChatApp';
const port = process.env.PORT || 5000;

const accountRouter = require("./routes/accountRoutes.js");
const authCheck = require("./middleware/authCheck.js");
const authAccountRouter = require("./routes/authAccountRoutes.js");
const messageRouter = require("./routes/messageRoutes.js");
const roomRouter = require("./routes/roomRoutes.js");

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
    //console.log(`Socket ${socket.id} Connected`);

    socket.on('joinRoom', (roomName) => {
        socket.join(roomName);
        console.log(`Socket ${socket.id} Joined room ${roomName}`);
    });

    socket.on('sendMessage', (room, message) => {
        io.to(room).emit('newMessage', room, message);
    });

    socket.on('disconnect', () => {
        //console.log('Someone Disconnected');
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
app.use('/rooms', roomRouter);
app.use('/messages', messageRouter);
app.use('/authAccounts', authAccountRouter);
