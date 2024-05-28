require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const server = require('http').createServer(app);


const frontendUrl = process.env.FRONTEND_URL;
const url = process.env.DATABASE_URL;
const port = 5000;

const accountRouter = require("./routes/accountRoutes.js");
const authCheck = require("./middleware/authCheck.js");
const authAccountRouter = require("./routes/authAccountRoutes.js");
const messageRouter = require("./routes/messageRoutes.js");

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
    console.log("a new socket connected");

    socket.on('sendMessage', (info) => {
        console.log('message Recieve');
        console.log(info)
        io.emit('newMessage', info);
    });

    socket.on('disconnect', () => {
        console.log('Someone Disconnected');
    })
});

// Middleware / Routes
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', frontendUrl);
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

app.use('/accounts', accountRouter);
app.use('/messages', messageRouter);
app.use(authCheck);
app.use('/authAccounts', authAccountRouter);
