import { Server, Socket } from 'socket.io';
import { PlayList } from './music';

interface userList {
  [socketid: string]: number;
}

interface socketInfo {
  id: number;
  name: string;
  socketId: string[];
  description: string;
}

const userHash: userList = {};
let userNum: number = 0;

let socketData: socketInfo[] = [];

const socketHandler = (io: Server) => {
  const namespace = io.of('/music');

  namespace.on('connection', socket => {
    console.log('아이디: ', socket.id);

    userHash[socket.id] = userNum;
    userNum += 1;

    socket.broadcast.emit('enterRoom', 'new user connected');
    socket.on('disconnect', () => {
      socket.broadcast.emit('leaveRoom', 'user disconnected');

      console.log(socketData);
      console.log(socket.id);

      const targetRoom: socketInfo = socketData.find(
        val => val.socketId.some(client => client === socket.id) === true,
      )!;

      if (targetRoom !== undefined) {
        targetRoom.socketId = targetRoom.socketId.filter(val => val !== socket.id);
        if (!targetRoom.socketId.length) {
          socketData.splice(socketData.indexOf(targetRoom), 1);
          const data = socketData.map(val => {
            return { id: val.id, name: val.name, description: val.description };
          }); // utils로 기능 빼기
          socket.broadcast.emit('updateRoomList', { list: data });
        }
      }

      // targetRoom이 존재하지 않을 경우도 고려해서 try, catch 적용해보기.
    });
    socket.on('chatMessage', (message: string) => {
      const targetRoom = socketData.find(
        val => val.socketId.some(client => client === socket.id) === true,
      );

      if (targetRoom !== undefined) {
        socket.to(targetRoom.name).emit('chatMessage', { id: userHash[socket.id], msg: message });
      }
    });

    socket.on('responseTime', (data: string) => {
      socket.broadcast.emit('sync', data);
    });

    socket.on('pause', (data: string) => {
      const targetRoom = socketData.find(val => val.socketId[0] === socket.id);

      if (targetRoom !== undefined) {
        socket.to(targetRoom.name).emit('clientPause', '멈춰!');
      }
    });

    socket.on('play', (data: string) => {
      const targetRoom = socketData.find(val => val.socketId[0] === socket.id);

      if (targetRoom !== undefined) {
        socket.to(targetRoom.name).emit('clientPlay', '시작해!');
      }
    });

    socket.on('moving', (data: string) => {
      const targetRoom = socketData.find(val => val.socketId[0] === socket.id);

      if (targetRoom !== undefined) {
        socket.to(targetRoom.name).emit('clientMoving', data);
      }
    });

    socket.on('request', ([page, count]) => {
      namespace.to(socket.id).emit('response', PlayList.getPlayListByPage(page, count));
    });

    socket.on('nextMusicReq', ({ src }) => {
      const targetRoom = socketData.find(
        val => val.socketId.some(client => client === socket.id) === true,
      );

      if (socket.id !== targetRoom?.socketId[0]) return;

      // namespace.to(socket.id).emit('nextMusicRes', PlayList.getNextMusic());
      socket.to(targetRoom.name).emit('clientPlay', src);
    });

    socket.on('currentMusicReq', () => {
      socket.emit('currentMusicRes', PlayList.getCurrentMusic());

      // if (socketData.length > 1) {
      //   socket.broadcast.to([socketData[0]]).emit('requestTime', 'time');
      // }
    });

    socket.on('createRoom', data => {
      console.log(data);
      socket.join(data.name);
      socketData.push({
        id: data.id,
        name: data.name,
        socketId: [socket.id],
        description: data.description,
      });

      const roomList = socketData.map(val => {
        return { id: val.id, name: val.name, description: val.description };
      }); // utils로 기능 빼기

      socket.broadcast.emit('updateRoomList', { list: roomList });
    });

    socket.on('joinRoom', roomname => {
      console.log('테스트용', roomname);
      socket.join(roomname);
      if (
        !socketData.some(val => {
          return val.name === roomname;
        })
      ) {
        socketData.push({ id: 3, name: roomname, socketId: [socket.id], description: 'des' });
      } else {
        const target = socketData.find(val => val.name === roomname);
        target?.socketId.push(socket.id);
        if (!!target?.socketId.length) {
          socket.broadcast.to([target.socketId[0]]).emit('requestTime', 'time');
        }
      }

      namespace.to(roomname).emit('joinRoomClient', `${roomname} 입니다. 누군가가 입장했습니다.`);
    });
  });
};

export { socketHandler, socketData };
