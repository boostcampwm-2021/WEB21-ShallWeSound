import { Server, Socket } from 'socket.io';
import { socketData, userHash } from './userData';
import { PlayList } from './music';
import musicService from '../services/music';
import { utils } from '../utils/util';
import type { Music, socketInfo } from '../types';

// const playList = new PlayList();
let userNum: number = 0;

const socketHandler = (io: Server) => {
  const namespace = io.of('/music');

  namespace.on('connection', socket => {
    console.log('접속 중: ', socket.id);

    userHash[socket.id] = userNum;
    userNum += 1;

    socket.broadcast.emit('enterRoom', 'new user connected');

    socket.on('disconnect', () => {
      socket.broadcast.emit('leaveRoom', 'user disconnected');

      const targetRoom: socketInfo = utils.findRoom(socketData, socket.id);

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
      const targetRoom: socketInfo = utils.findRoom(socketData, socket.id);

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

    socket.on('requestPlayList', page => {
      const targetRoom = socketData.find(
        val => val.socketId.some(client => client === socket.id) === true,
      );

      const res = targetRoom?.playList.getPlayListByPage(page);
      namespace.to(socket.id).emit('responsePlayList', res);
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
      const targetRoom = socketData.find(
        val => val.socketId.some(client => client === socket.id) === true,
      );

      socket.emit('currentMusicRes', targetRoom?.playList.getCurrentMusic());

      // if (socketData.length > 1) {
      //   socket.broadcast.to([socketData[0]]).emit('requestTime', 'time');
      // }
    });

    socket.on('addMusicInPlayListReq', async (MIDS: number[]) => {
      const targetRoom = socketData.find(
        val => val.socketId.some(client => client === socket.id) === true,
      );

      const musics: Music[] = await musicService.findMusicsBy(MIDS);
      targetRoom?.playList.addMusics(musics);
    });

    socket.on('createRoom', data => {
      console.log(data);
      socket.join(data.name);
      socketData.push({
        id: data.id,
        name: data.name,
        socketId: [socket.id],
        description: data.description,
        playList: new PlayList(),
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
      } else {
        const target = socketData.find(val => val.name === roomname);
        target?.socketId.push(socket.id);
        if (target?.socketId.length) {
          socket.broadcast.to([target.socketId[0]]).emit('requestTime', 'time');
          namespace
            .to(roomname)
            .emit('joinRoomClient', `${roomname} 입니다. 누군가가 입장했습니다.`);
        }
      }
    });
  });
};

export { socketHandler, socketData };
