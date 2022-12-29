var name;
fetch("http://localhost:3000/getcookie").then((data)=>data.json()).then((res)=>{
            document.getElementById("name").innerHTML=res.name;
            name=res.name;

        })
const socket=io();
const textarea=document.getElementById("textarea");
const msgarea=document.querySelector(".message__area");
const send=document.querySelector(".send");

// console.log(socket);
textarea.addEventListener('keyup',(e)=>{
    if(e.key==='Enter'){
        sendMessage(e.target.value);
    }
})
send.addEventListener("click",()=>{
    sendMessage(textarea.value);

})

const sendMessage=(message)=>{
    const msg={
        user:name,
        message:message.trim()
    }
    appendMessage(msg,'outgoing');
    textarea.value='';

    socket.emit('message',msg);

}
const appendMessage=(msg,type)=>{
    let msgarea=document.querySelector('.message__area')
    let mdiv=document.createElement('div');
    // let className=type;
    mdiv.classList.add(type,'message');
    mdiv.innerHTML=`<h4>${msg.user}</h4><p>${msg.message}</p>`;
    msgarea.appendChild(mdiv)
}
socket.on('message',(msg)=>{
    appendMessage(msg,'incoming');
})

