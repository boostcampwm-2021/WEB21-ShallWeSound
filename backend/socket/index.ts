import { Server } from 'socket.io';
import http from 'http';

export default (server: http.Server) => {
  const io = new Server(server, { cors: { origin: '*' } });

  io.on('connection', socket => {
    console.log('socket connection');
  });
  // userSpace(io, sessionMiddleware);
  // multiSpace(io);
};
