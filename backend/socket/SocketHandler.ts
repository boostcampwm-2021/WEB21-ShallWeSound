import { Server, Socket } from 'socket.io';
import { PlayList } from './music';

interface userList {
  [socketid: string]: number;
}

interface socketInfo {
  title: string;
  socketId: string[];
}

const userHash: userList = {};
let userNum: number = 0;

let socketData: socketInfo[] = [];

const socketHandler = (io: Server) => {
  const namespace = io.of('/music');

  namespace.on('connection', socket => {
    userHash[socket.id] = userNum;
    userNum += 1;

    socket.broadcast.emit('enterRoom', 'new user connected');
    socket.on('disconnect', () => {
      socket.broadcast.emit('leaveRoom', 'user disconnected');
      // socketData = socketData.filter(socketID => {
      //   return socketID !== socket.id;
      // });
    });
    socket.on('chatMessage', (message: string) => {
      // console.log(userHash[socket.id]);
      socket.to('최고다 이순신').emit('chatMessage', { id: userHash[socket.id], msg: message });
    });

    socket.on('responseTime', (data: string) => {
      socket.broadcast.emit('sync', data);
    });

    socket.on('pause', (data: string) => {
      const targetRoom = socketData.find(val => val.socketId[0] === socket.id);

      if (targetRoom !== undefined) {
        socket.to(targetRoom.title).emit('clientPause', '멈춰!');
      }
    });

    socket.on('play', (data: string) => {
      const targetRoom = socketData.find(val => val.socketId[0] === socket.id);

      if (targetRoom !== undefined) {
        socket.to(targetRoom.title).emit('clientPlay', '시작해!');
      }
    });

    socket.on('moving', (data: string) => {
      const targetRoom = socketData.find(val => val.socketId[0] === socket.id);

      if (targetRoom !== undefined) {
        socket.to(targetRoom.title).emit('clientMoving', data);
      }
    });

    socket.on('request', ([page, count]) => {
      namespace.to(socket.id).emit('response', PlayList.getPlayListByPage(page, count));
    });

    // socket.on('nextMusicReq', ({ src }) => {
    //   if (socket.id !== socketData[0]) return;

    //   // namespace.to(socket.id).emit('nextMusicRes', PlayList.getNextMusic());
    //   namespace.emit('nextMusicRes', src);
    // });

    socket.on('currentMusicReq', () => {
      socket.emit('currentMusicRes', PlayList.getCurrentMusic());

      // if (socketData.length > 1) {
      //   socket.broadcast.to([socketData[0]]).emit('requestTime', 'time');
      // }
    });

    socket.on('joinRoom', roomTitle => {
      socket.join(roomTitle);
      if (
        !socketData.some(val => {
          return val.title === roomTitle;
        })
      ) {
        socketData.push({ title: roomTitle, socketId: [socket.id] });
      } else {
        const target = socketData.find(val => val.title === roomTitle);
        target?.socketId.push(socket.id);
        if (!!target?.socketId.length) {
          socket.broadcast.to([target.socketId[0]]).emit('requestTime', 'time');
        }
      }

      namespace.to(roomTitle).emit('joinRoomClient', `${roomTitle} 입니다. 누군가가 입장했습니다.`);
    });
  });
};

export { socketHandler };
