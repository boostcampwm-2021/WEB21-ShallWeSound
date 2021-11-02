import express from 'express';
import cors from 'cors';
import path from 'path';
import http from 'http';
import socketIo, { Socket } from 'socket.io';
import { socketHandler } from './utils/SocketHandler';
import roomRouter from './routes/room';

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const io = require('socket.io')(server);
// const io = new Server(server);

app.use(cors);
app.use(express.static(path.join(__dirname, 'videos')));

app.get('/', (req, res) => {
  return res.status(200).sendFile(`${__dirname}/index.html`);
});
interface userList {
  [socketid: string]: number;
}
const userHash: userList = {};
let userNum: number = 0;

io.on('connection', (socket: any) => {
  console.log(socket.id);
  userHash[socket.id] = userNum;
  userNum += 1;
  socket.broadcast.emit('enterRoom', 'new user connected');
  socket.on('disconnect', () => {
    socket.broadcast.emit('leaveRoom', 'user disconnected');
  });
  socket.on('chatMessage', (message: string) => {
    console.log(userHash[socket.id]);
    socket.broadcast.emit('chatMessage', { id: userHash[socket.id], msg: message });
  });
});

// server.listen(5000, () => console.log("App listening on port 5000..."));

app.set('port', 3000);

io.on('connection', socketHandler);

app.use('/room', roomRouter);

import socket from './socket';
socket(server);

server.listen(app.get('port'));
