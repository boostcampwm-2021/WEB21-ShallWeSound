import express from 'express';
import cors from 'cors';
import path from 'path';
import http from 'http'
import https from 'https';
import dotenv from 'dotenv';
import MusicService from './services/music';
dotenv.config({ path: __dirname + '/config/.env' });
import fs from 'fs'
import socket from './socket';
import roomRouter from './routes/room';
import audioRouter from './routes/audio';
import apiRouter from './routes/api/';
import uploadRouter from './routes/upload';
import downloadRouter from './routes/download';
import loginRouter from './routes/login';


const models = require('./models/index.js');
const app: express.Application = express();
const server: http.Server = http.createServer(app);

const sequelize = require('sequelize');
const SequelizeAuto = require('sequelize-auto');


app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);


app.use('/api', apiRouter);

app.get('/', (req, res) => {
  // client.set("key", "value", redis.print);
  // console.log(client.get("key", redis.print));
  res.send('hello');
});

app.use('/room', roomRouter);
app.use('/audio', audioRouter);
app.use('/upload', uploadRouter);
app.use('/download', downloadRouter);
app.use('/oauth', loginRouter);

app.use(express.static(path.join(__dirname, 'videos')));

app.set('port', 3000);

server.listen(3000);

socket(server);
