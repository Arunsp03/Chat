const { log } = require("console");
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const app = express();
let users=[];
const httpServer = createServer(app);
const io = new Server(httpServer, {  
    cors:"http://127.0.0.1:5500"
});

io.on("connection", (socket) => {
    socket.on("connected",(data)=>{
       const {username}=data;
       console.log("username",username);
        console.log("socket id",socket.id);
        users.push({"username":username,"socket":socket.id});
        io.emit("userlist",users);
        
    })
    socket.on("userlist",()=>{
       socket.emit("userlist",users);
     })
});

httpServer.listen(3000);