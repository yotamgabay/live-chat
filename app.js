const socket = io("https://yotam-chat-app.herokuapp.com/")
const messageInput = document.getElementById('user-input')
const messageContainer = document.getElementById('messages-container')
const sendForm = document.getElementById("send-message-container")
window.mobileCheck();
//users joining
var user_name = prompt("Enter your name:").trim()
if(user_name != null && user_name != ""){
    drawUsers('You joined the chat', true)
}
socket.emit("user-joined", user_name)

socket.on('user-connected',name => {
    drawUsers(name + " joined the chat");
})

window.mobileCheck = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    if(check){
        document.getElementById('messages-container').style.width = "90vw";
        document.getElementById('user-input').style.width = "60vw";
        document.getElementById('send-button').style.width = "22vw";

    }
    else{
        console.log("pipi")
    }
  };
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


