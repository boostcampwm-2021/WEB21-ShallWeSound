import express from 'express';
import {Server} from 'socket.io';
import http from 'http';
import cors from 'cors';
const app: express.Application = express();
app.use(cors);
const server:http.Server = http.createServer(app);
const io = new Server(server);
app.get('/', (req, res) => {
  res.send('정상 작동합니다.');
});
interface userList{
  [socketid:string] : number;
}
const userHash:userList={}
let userNum:number = 0;
io.on('connection', (socket)=>{
  console.log(socket.id);
  userHash[socket.id] = userNum;
  userNum+=1;
  socket.broadcast.emit('enterRoom', 'new user connected');
  socket.on('disconnect', ()=>{
    socket.broadcast.emit('leaveRoom', 'user disconnected');
  })
  socket.on('chatMessage', (message:string)=>{
    console.log(userHash[socket.id]);
    socket.broadcast.emit('chatMessage',{id:userHash[socket.id], msg:message});
  })
})

server.listen(5000, () => console.log("App listening on port 5000..."));