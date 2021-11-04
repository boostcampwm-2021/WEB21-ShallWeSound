import { Socket } from 'socket.io';

const socketData: string[] = [];

const socketHandler = (socket: Socket) => {
  if (socketData.length !== 0) {
    socket.broadcast.to([socketData[0]]).emit('requestTime', 'time');
  }

  socketData.push(socket.id);

  socket.on('responseTime', (data: string) => {
    socket.broadcast.emit('sync', data);
  });

  socket.on('pause', (data: string) => {
    if (socket.id === socketData[0]) {
      socket.broadcast.emit('clientPause', '멈춰!');
    }
  });

  socket.on('play', (data: string) => {
    if (socket.id === socketData[0]) {
      socket.broadcast.emit('clientPlay', '시작해!');
    }
  });

  socket.on('moving', (data: string) => {
    if (socket.id === socketData[0]) {
      console.log('모두들 시작하세요');
      socket.broadcast.emit('clientMoving', data);
    }
  });
};

export { socketHandler };
