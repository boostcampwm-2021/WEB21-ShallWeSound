import { Server, Socket } from 'socket.io';
import { PlayList } from './music';
import musicService from '../services/music';
import type { Music } from '../types';

interface userList {
  [socketid: string]: number;
}
const userHash: userList = {};
let userNum: number = 0;

let socketData: string[] = [];

const socketHandler = (io: Server) => {
  const namespace = io.of('/music');

  namespace.on('connection', socket => {
    console.log(socket.id);

    userHash[socket.id] = userNum;
    userNum += 1;

    socketData.push(socket.id);

    if (!!socketData.length) {
      socket.broadcast.to([socketData[0]]).emit('requestTime', 'time');
    }

    socket.broadcast.emit('enterRoom', 'new user connected');
    socket.on('disconnect', () => {
      socket.broadcast.emit('leaveRoom', 'user disconnected');
      socketData = socketData.filter(socketID => {
        return socketID !== socket.id;
      });
    });
    socket.on('chatMessage', (message: string) => {
      // console.log(userHash[socket.id]);
      socket.broadcast.emit('chatMessage', { id: userHash[socket.id], msg: message });
    });

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

    socket.on('requestPlayList', page => {
      const res = PlayList.getPlayListByPage(page);
      namespace.to(socket.id).emit('responsePlayList', res);
    });

    socket.on('nextMusicReq', ({ src }) => {
      if (socket.id !== socketData[0]) return;

      // namespace.to(socket.id).emit('nextMusicRes', PlayList.getNextMusic());
      namespace.emit('nextMusicRes', src);
    });

    socket.on('currentMusicReq', () => {
      socket.emit('currentMusicRes', PlayList.getCurrentMusic());

      // if (socketData.length > 1) {
      //   socket.broadcast.to([socketData[0]]).emit('requestTime', 'time');
      // }
    });

    socket.on('addMusicInPlayListReq', async (MIDS: number[]) => {
      const musics: Music[] = await musicService.findMusicsBy(MIDS);
      PlayList.addMusics(musics);
    });
  });
};

export { socketHandler };
