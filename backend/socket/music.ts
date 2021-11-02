import { Server } from 'socket.io';

interface Music {
  name: string;
}

export default (io: Server) => {
  const namespace = io.of('/music');

  const playList: Music[] = [
    {
      name: '좋은 날',
    },
    {
      name: 'savage',
    },
  ];

  namespace.on('connection', socket => {
    console.log(socket.id + ' connected');

    socket.emit('init', playList);
  });
};
