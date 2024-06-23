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
    // console.log(messagequeue);
    messagequeue.map((message)=>{
    
        if(message.sender.toString()==element.innerHTML.toString() || message.receivername.toString()==element.innerHTML.toString())
            {
                msg.push(message);
            }
    })
 
    document.querySelector(".message-section").innerHTML=''
    msg.map((data)=>{
    let element=document.createElement("textarea");
    element.innerHTML=data.message;
    element.disabled=true;
    if(data.sender!=username)
    {
        element.classList.add("received-message");  
    }
    else{
    element.classList.add("sent-message");
    }
    document.querySelector(".message-section").append(element);
    })
    
}
})
socket.on("userlist",(data)=>{
    userlist=data;
    if(userlist){
        document.querySelector(".users").innerHTML='';
        const element=document.createElement("p");
        element.innerHTML=username;
        element.classList.add("current-user");
        document.querySelector(".users").appendChild(element)
        userlist.map(data => {
            if(data.username!=username){
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
                    
                        if(message.sender.toString()==element.innerHTML.toString() || message.receivername.toString()==element.innerHTML.toString()  )
                            {
                                msg.push(message);
                            }
                    })
                    msg.map((data)=>{
                        let element=document.createElement("textarea");
                        element.textContent =data.message;
                        element.disabled=true;
                        if(data.sender!=username)
                        {
                            element.classList.add("received-message");  
                        }
                        else{
                        element.classList.add("sent-message");
                        }
                        document.querySelector(".message-section").append(element);
                        })
                }
            
        })
        document.querySelector(".users").appendChild(element);
    }
    });
}
})
function sendmsg()
{
   
    const receiver=document.querySelector(".selected");
    if(receiver){
    const receiverId=receiver.id;
    const message=document.getElementById('msg-input').value;
    socket.emit("message",{sender:username,receiver:userlist[receiverId].socket,receivername:userlist[receiverId].username,message:message})
    let elem=document.createElement("textarea");
    elem.textContent=message;
    elem.classList.add("sent-message");
    elem.disabled=true;
    document.querySelector(".message-section").append(elem);
    messagequeue.push({sender:username,receiver:userlist[receiverId].socket,receivername:userlist[receiverId].username,message:message});
    document.getElementById('msg-input').value=''
    }
    else{
        alert("select a receiver")
    }
}
