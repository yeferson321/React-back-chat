import express from "express";
import morgan from "morgan";
import cors from "cors";
import { Server as SocketServer } from 'socket.io';
import http from 'http';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
    maxHttpBufferSize: 1000e8,
    cors: {
      origin: ["https://gleaming-stroopwafel-b44634.netlify.app"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }
});

const options = { origin: "https://gleaming-stroopwafel-b44634.netlify.app", }
app.use(cors(options))

app.use(morgan('dev'));


io.on('connection', (socket) => {

    socket.on('messageText', (messageObject) => {
        socket.broadcast.emit('message', {
            body: messageObject.body,
            user_id: socket.id,
            type: messageObject.type,
            name: socket.name,
            mimeType: messageObject.mimeType,
            from: "User"
        })
        console.log("messageText", messageObject)
    })

    // socket.on("messageFile", (messageFile) => {
    //     socket.broadcast.emit('messageFile', {
    //         user_id: socket.id,
    //         body: messageFile.file,
    //         type: messageFile.type,
    //         name: socket.name,
    //         size: socket.size,
    //         from: "User"
    //     })
    //     console.log("messageFile", messageFile);
    // });
    
})

// starting the server
server.listen(process.env.PORT || 5000, () => {
    console.log(`server on port ${process.env.PORT || 5000}`);
})