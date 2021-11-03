import { Server } from 'socket.io';
import http from 'http';
import { musicSocket } from './music';

export default (server: http.Server) => {
  const io = new Server(server, { cors: { origin: '*' } });

  musicSocket(io);
};
