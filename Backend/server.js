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
        const existingUserIndex = users.findIndex(user => user.username === username);
        
        if (existingUserIndex !== -1) {
            
            users[existingUserIndex].socket = socket.id;
            console.log("User already exists, updated socket ID");
        } else {
           
            users.push({ "username": username, "socket": socket.id });
            console.log("New user added");
        }

        io.emit("userlist", users);
        
    })
    socket.on("userlist",()=>{
       socket.emit("userlist",users);
     })
     socket.on("message",(data)=>{
        const {sender,receiver,message,receivername}=data;
        console.log(receiver);
        socket.to(receiver).emit("message",{sender:sender,receivername,message});
     })
});

httpServer.listen(3000);