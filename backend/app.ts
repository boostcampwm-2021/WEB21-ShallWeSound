import express from 'express';
import {Server} from 'socket.io';
import http from 'http';
const app: express.Application = express();
const server:http.Server = http.createServer(app);
const io = new Server(server);
app.get('/', (req, res) => {
  res.send('정상 작동합니다.');
});
interface userList{
  [socketid:number] : number;
}
const userHash:userList={}
let userNum:number = 0;
io.on('connection', (socket)=>{
  console.log('new user connected');
  socket.broadcast.emit('enterRoom', 'new user connected');
  socket.on('disconnect', ()=>{
    socket.broadcast.emit('leaveRoom', 'user disconnected');
  })
  socket.on('chatMessage', (message:string)=>{
    socket.broadcast.emit('chatMessage', message);
  })
})

server.listen(5000, () => console.log("App listening on port 5000..."));