import { Server } from 'socket.io';
import http from 'http';
import music from './music';

export default (server: http.Server) => {
  const io = new Server(server, { cors: { origin: '*' } });

  music(io);
};
