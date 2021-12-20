const http = require("http");
const express = require("express");
const socketIo = require("socket.io");
const uuid = require("uuid");

const app = express();
const server = http.createServer(app);
const io = new socketIo.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
    },
});

let onlineUsers = [];

io.on("connection", (socket) => {
    socket.on("NEW_USER", (username) => {
        onlineUsers.push({
            socketId: socket.id,
            username: username,
        });
    });

    socket.on("NEW_MESSAGE", (content) => {
        const sender = onlineUsers.find((user) => user.socketId === socket.id);
        io.emit("NEW_MESSAGE", { sender: sender, content: content });
    });
});

app.get("/", (req, res) => {
    res.send("Welcome to our socket server");
});
// app.use(function (req, res, next) {

//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//     // Request headers you wish to allow
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     res.setHeader('Access-Control-Allow-Credentials', true);

//     // Pass to next layer of middleware
//     next();
// });
server.listen(8080, () => {
    console.log("Server is running at 8080");
});
