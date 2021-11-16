import express from 'express';
import cors from 'cors';
import path from 'path';
import http from 'http';
import dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/config/.env' });

import socket from './socket';
import roomRouter from './routes/room';
import audioRouter from './routes/audio';
import apiRouter from './routes/api/';
import uploadRouter from './routes/upload';
import downloadRouter from './routes/download';

const models = require('./models/index.js');
const app: express.Application = express();
const server: http.Server = http.createServer(app);

const sequelize = require('sequelize');
const SequelizeAuto = require('sequelize-auto');

// models.sequelize.sync().then(() => {
//   console.log('연결 성공');
// });

app.use(
  cors({
    origin: 'http://localhost:3001',
    credentials: true,
  }),
);

app.use('/api', apiRouter);

app.get('/', (req, res) => {
  res.send('hello');
});

app.use('/room', roomRouter);
app.use('/audio', audioRouter);
app.use('/upload', uploadRouter);
app.use('/download', downloadRouter);

app.use(express.static(path.join(__dirname, 'videos')));

app.set('port', 3000);

server.listen(3000);

socket(server);
