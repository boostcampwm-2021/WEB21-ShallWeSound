import express from 'express';
import cors from 'cors';
import path from 'path';
import http from 'http';
import socket from './socket';
import roomRouter from './routes/room';
import audioRouter from './routes/audio';
import uploadRouter from './routes/upload';
import dotenv from 'dotenv';
dotenv.config({path:'config/.env'});
const app: express.Application = express();
const server: http.Server = http.createServer(app);
// const io = require('socket.io')(server);
// const io = new Server(server);

app.get('/', (req, res) => {
  res.send('hello');
});

app.use('/room', roomRouter);
app.use('/audio', audioRouter);
app.use('/upload', uploadRouter);

app.use(cors);
app.use(express.static(path.join(__dirname, 'videos')));

app.set('port', 3000);

server.listen(3000);

socket(server);
