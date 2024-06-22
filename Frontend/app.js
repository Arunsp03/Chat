let userlist=[];
let messagequeue=[];
const username=sessionStorage.getItem("username");
const socket = io("http://localhost:3000");
socket.emit("connected",{
    "username":sessionStorage.getItem("username")
});
socket.emit("userlist");
socket.on("message",(data)=>{
    const {sender,receivername,message}=data;
    messagequeue.push({sender,receivername,message});   
    const element=document.querySelector(".selected")
    if (element){
    let msg=[];
    messagequeue.map((message)=>{
    
        if(message.sender.toString()==element.innerHTML.toString())
            {
                msg.push(message);
            }
    })
    console.log("messages",msg);
}
})
socket.on("userlist",(data)=>{
    userlist=data;
    if(userlist){
        document.querySelector(".users").innerHTML='';
        userlist.forEach(data => {
        let element=document.createElement("p");
        element.classList.add("username")
        element.id=userlist.indexOf(data);
        element.innerHTML=data.username;
        element.addEventListener("click",()=>{
            document.querySelector(".message-section").innerHTML='';
            if(element.classList.contains("selected"))
                {
                   
                    element.classList.remove("selected");
                }
                else{
                    const existingelem=document.querySelector(".selected")
                    if(existingelem){
                    existingelem.classList.remove("selected");
                    }
                    element.classList.add("selected");
                    let msg=[];
                    messagequeue.map((message)=>{
                    
                        if(message.sender.toString()==element.innerHTML.toString())
                            {
                                msg.push(message);
                            }
                    })
                    console.log("messages",msg);
                    // console.log(messages);
                    // console.log(messagequeue);
                }
            
        })
        document.querySelector(".users").append(element);
    });
}
})
function sendmsg()
{
    const receiver=document.querySelector(".selected");
    const receiverId=receiver.id;
    const message=document.getElementById('msg-input').value;
    socket.emit("message",{sender:username,receiver:userlist[receiverId].socket,receivername:userlist[receiverId].username,message:message})
   
   
}
