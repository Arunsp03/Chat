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
        const existingUserIndex = users.findIndex(user => user.username === username);
        
        if (existingUserIndex !== -1) {
            
            users[existingUserIndex].socket = socket.id;
        
        } else {
           
            users.push({ "username": username, "socket": socket.id });
          
        }

        io.emit("userlist", users);
        
    })
    socket.on("userlist",()=>{
       socket.emit("userlist",users);
     })
     socket.on("message",(data)=>{
        const {sender,receiver,message,receivername}=data;
        
        socket.to(receiver).emit("message",{sender:sender,receivername,message});
     })
});

httpServer.listen(3000);