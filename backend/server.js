require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');

const { InMemorySessionStore } = require('./functions/sessonStore.js');
const setupSockets = require('./socket');

const app = express();
const server = http.createServer(app);

const sessionStore = new InMemorySessionStore();

const frontendUrl = process.env.FRONTEND_URL || 'http://127.0.0.1:3000';

app.use(cors({
    origin: frontendUrl,
    credentials: true
}));

// connect DB
mongoose.connect(process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/ChattyApp')
    .then(() => console.log('Connected to Database'))
    .catch(err => console.log(err));

// middlewares
app.use(express.json());
app.use(cors({
    origin: frontendUrl,
    allowedHeaders: ['Access-Control-Allow-Headers', 'Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    methods: "GET,POST,DELETE,OPTIONS",
    preflightContinue: false
}));

// routes
app.get('/test', (req, res) => res.status(200).json({ message: 'Test returned!' }));
app.use('/accounts', require("./routes/accountRoutes.js"));
app.use(require("./middleware/authCheck.js"));
app.use('/messages', require("./routes/messageRoutes.js"));
app.use('/rooms', require("./routes/roomRoutes.js"));
app.use('/authAccounts', require("./routes/authAccountRoutes.js"));
app.use('/notifications', require("./routes/notificationRoutes.js"));

// sockets
setupSockets(io, sessionStore);

// start server
const port = process.env.PORT || 5000;
server.listen(port, () => console.log('Server running on', port));
