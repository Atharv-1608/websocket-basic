import {WebSocket, WebSocketServer} from 'ws'

const wss = new WebSocketServer({port : 8080})

interface User {
    socket : WebSocket,
    room : string
}

let userCount = 0;
let allSocket : User[] = []


wss.on('connection',(socket)=>{
    
    socket.on("message",(message)=>{

        try{
        const parsedMessage = JSON.parse(message.toString());

        if(parsedMessage.type == "chat"){

            let currentUserRoom = null;
            for(let i = 0 ; i<allSocket.length;i++){
                if(allSocket[i].socket==socket){
                    currentUserRoom = allSocket[i].room
                }
            }
            for(let i = 0 ; i<allSocket.length;i++){
                if(allSocket[i].room == currentUserRoom){
                    allSocket[i].socket.send(parsedMessage.payload.message)
                }
            }
        }

        if(parsedMessage.type == "join"){
            allSocket.push({
                socket,
                room : parsedMessage.payload.room
            })
        }
        }
        catch(err){
             console.error("Invalid message:", err);
        }
        
    })


})