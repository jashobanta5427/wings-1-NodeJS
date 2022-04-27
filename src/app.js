const express = require("express");
const sellAndBuyRouter = require("./routers/sellAndBuy");
require('./mongoose/connect_db/mongoose');

//setting up the express server
const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Origin", "*"); 
    if (req.method === "OPTIONS") { 
        res.header("Access-Control-Allow-Methods", "GET, PATCH, POST, DELETE"); 
        return res.status(200).json({}); 
    }
    next();
});

app.use(express.json()); 
app.use(sellAndBuyRouter);

module.exports = app;