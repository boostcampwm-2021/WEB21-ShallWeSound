import { Server } from 'socket.io';
import http from 'http';
import { socketHandler } from './SocketHandler';

export default (server: http.Server) => {
  const io = new Server(server, { cors: { origin: '*' } });

  socketHandler(io);
};
