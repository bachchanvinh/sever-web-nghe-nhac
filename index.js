const http = require("http");
const express = require("express");
const socketIo = require("socket.io");
const uuid = require("uuid");
const cors = require('cors');
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
app.use(cors());
server.listen(process.env.PORT || 8080, () => {
    console.log("Server is running at 8080");
});
