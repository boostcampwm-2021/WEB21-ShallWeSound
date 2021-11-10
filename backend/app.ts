import express from 'express';
import cors from 'cors';
import path from 'path';
import http from 'http';
import socket from './socket';
import roomRouter from './routes/room';
import audioRouter from './routes/audio';
import 'dotenv/config';

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const Sequelize = require('sequelize');
const SequelizeAuto = require('sequelize-auto');
const auto = new SequelizeAuto('SWS', process.env.DB_ID, process.env.DB_PW, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
});
auto.run((err: Error) => {
  if (err) throw err;
});
// const io = require('socket.io')(server);
// const io = new Server(server);

app.get('/', (req, res) => {
  res.send('hello');
});
app.use('/room', roomRouter);
app.use('/audio', audioRouter);

app.use(cors);
app.use(express.static(path.join(__dirname, 'videos')));

app.set('port', 3000);

server.listen(3000);

socket(server);
