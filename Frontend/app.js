const socket = io("http://localhost:3000");
socket.emit("connected",{
    "username":localStorage.getItem("username")
});
socket.emit("userlist");
socket.on("userlist",(data)=>{
    console.log("uer entered");
    console.log(data);
})