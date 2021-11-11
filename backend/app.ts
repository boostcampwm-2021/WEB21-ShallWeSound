import express from 'express';
import cors from 'cors';
import path from 'path';
import http from 'http';
import socket from './socket';
import roomRouter from './routes/room';
import audioRouter from './routes/audio';
import apiRouter from './routes/api';
import 'dotenv/config';

const models = require('./models/index.js');
const app: express.Application = express();
const server: http.Server = http.createServer(app);

const sequelize = require('sequelize');
const SequelizeAuto = require('sequelize-auto');

models.sequelize.sync().then(() => {
  console.log('연결 성공');
});

// models.MUSIC.findAll({
//   where: { singer: 'IU' },
// }).then((result: any) => {
//   console.log(result[0].singer);
// });

console.log(process.env.DB_HOST, process.env.DB_ID, process.env.DB_PW);

// const io = require('socket.io')(server);
// const io = new Server(server);

app.use(cors({ origin: '*' }));

app.use('/api', apiRouter);
app.use('/room', roomRouter);
app.use('/audio', audioRouter);

app.use(express.static(path.join(__dirname, 'videos')));

app.set('port', 3000);

server.listen(3000);

socket(server);
