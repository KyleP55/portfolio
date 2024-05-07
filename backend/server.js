require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();

const frontendUrl = process.env.FRONTEND_URL;
const url = process.env.DATABASE_URL;
const port = 5000;

const accountRouter = require("./routes/accountRoutes.js");
const authCheck = require("./middleware/authCheck.js");

// Connect to Mongo
try {
    mongoose.connect(url);
    console.log('Connected to Database');
} catch (err) {
    console.log(err);
}

// Listen on port
app.listen(port, () => {
    console.log('Sever running on', port);
});

// Middleware / Routes
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', frontendUrl);
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
});

app.use('/accounts', accountRouter);
app.use(authCheck);
