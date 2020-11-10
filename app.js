const socket = io("https://yotam-chat-app.herokuapp.com/")
const messageInput = document.getElementById('user-input')
const messageContainer = document.getElementById('messages-container')
const sendForm = document.getElementById("send-message-container")

//users joining
var user_name = prompt("Enter your name:").trim()
if(user_name != null && user_name != ""){
    drawUsers('You joined the chat', true)
}
socket.emit("user-joined", user_name)

socket.on('user-connected',name => {
    drawUsers(name + " joined the chat");
})

socket.on('user-invalid-name',() => {
    var user_name = prompt("Enter your name:").trim()
    if(user_name != null && user_name != ""){
        drawUsers('You joined the chat', true)
    }
socket.emit("user-joined", user_name)
})

socket.on('user-disconnected',name => {
    console.log(name + "left")
    drawUsers(name + " left the chat");
})

socket.on('chat-message',data => {
    console.log(data);
    drawMessage(data);
})

sendForm.addEventListener('submit', e =>{
    e.preventDefault()
    const message = messageInput.value.toString().trim();
    if(message.length <= 400 && message != ""){
        socket.emit('send-chat-message',message);
        drawMessage([name,message],true);
    }
    messageInput.value = ''
    
})
function drawMessage(message,isMyMessage = false){
    if (message != ""){
        const messageElement = document.createElement('div');
        const messageBody = document.createElement('a');
        const senderName = document.createElement('p');
        senderName.classList.add("message-sender");
        messageBody.classList.add('message-body');
        if(isMyMessage){
            messageElement.classList.add("send-message-style")
        }
        else{
            messageElement.classList.add("receive-message-style")
        }
        senderName.innerText = message[0]
        messageBody.innerText = message[1];
        messageContainer.append(messageElement);
        messageElement.append(senderName);
        messageElement.append(messageBody);
        if(message[1].match(/\.(jpeg|jpg|gif|png)$/)){
            const image = document.createElement('img');
            image.classList.add('sent-image');
            image.src = message[1];
            messageElement.append(image);
            messageBody.href = message[1];
        }
        
        //scroll down to see message
        var objDiv = document.getElementById("messages-container");
        objDiv.scrollTop = objDiv.scrollHeight;
        
    }
    
}
function drawUsers(text){
    const UserJoinedElement = document.createElement('div')
    UserJoinedElement.classList.add("user-joined-style")
    UserJoinedElement.innerText = text;
    messageContainer.append(UserJoinedElement);

    //scroll down to see message
    var objDiv = document.getElementById("messages-container");
    objDiv.scrollTop = objDiv.scrollHeight;
}


