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
      origin: '*',
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }
});

const options = { origin: '*',  }
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

})

// starting the server
server.listen(process.env.PORT || 5000, () => {
    console.log(`server on port ${process.env.PORT || 5000}`);
})