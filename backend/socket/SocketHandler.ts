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
      const targetRoom: socketInfo = utils.findRoom(socketData, socket.id);
      utils.updateDisconnectData(targetRoom, socketData, socket);
    });

    socket.on('chatMessage', (message: string) => {
      const targetRoom: socketInfo = utils.findRoom(socketData, socket.id);
      if (targetRoom !== undefined)
        socket.to(targetRoom.name).emit('chatMessage', { id: userHash[socket.id], msg: message });
    });

    socket.on('responseTime', (data: number) => {
      const targetRoom: socketInfo = utils.findRoom(socketData, socket.id);
      socket.broadcast.to(targetRoom.name).emit('sync', data);
    });

    socket.on('pause', (data: string) => {
      const targetRoom = utils.findRoomMaster(socketData, socket.id);
      if (targetRoom !== undefined) socket.to(targetRoom.name).emit('clientPause', '멈춰!');
    });

    socket.on('play', (data: string) => {
      const targetRoom = utils.findRoomMaster(socketData, socket.id);
      if (targetRoom !== undefined) socket.to(targetRoom.name).emit('clientPlay', '시작해!');
    });

    socket.on('moving', (data: string) => {
      const targetRoom = utils.findRoomMaster(socketData, socket.id);
      if (targetRoom !== undefined) socket.to(targetRoom.name).emit('clientMoving', data);
    });

    socket.on('requestPlayList', () => {
      const targetRoom: socketInfo = utils.findRoom(socketData, socket.id);
      const res = targetRoom?.playList.getPlayList() ?? [];
      namespace.to(socket.id).emit('responsePlayList', res);
    });

    socket.on('nextMusicReq', ({ src }) => {
      const targetRoom: socketInfo = utils.findRoom(socketData, socket.id);
      if (socket.id !== targetRoom?.socketId[0]) return;

      // namespace.to(socket.id).emit('nextMusicRes', PlayList.getNextMusic());
      socket.to(targetRoom.name).emit('clientPlay', src);
    });

    socket.on('currentMusicReq', () => {
      const targetRoom: socketInfo = utils.findRoom(socketData, socket.id);
      socket.emit('currentMusicRes', targetRoom?.playList.getCurrentMusic());

      // if (socketData.length > 1) {
      //   socket.broadcast.to([socketData[0]]).emit('requestTime', 'time');
      // }
    });

    socket.on('addMusicInPlayListReq', async (MIDS: number[]) => {
      const targetRoom: socketInfo = utils.findRoom(socketData, socket.id);
      if (!targetRoom) return;
      const musics: Music[] = await musicService.findMusicsBy(MIDS);
      targetRoom.playList.addMusics(musics);
      const res = targetRoom?.playList.getPlayList();
      namespace.to(targetRoom.name).emit('responsePlayList', res);
      namespace.to(targetRoom.name).emit('check', res);
    });

    socket.on('createRoom', data => {
      utils.updateNewRoom(socketData, socket, data);
      const roomList = utils.getRoomListForClient(socketData);
      socket.broadcast.emit('updateRoomList', { list: roomList });
    });

    socket.on('joinRoom', roomName => {
      socket.join(roomName);
      if (utils.isRoomExist(socketData, roomName)) {
        const target = utils.findRoomOnTitle(socketData, roomName);
        target?.socketId.push(socket.id);
        if (target?.socketId.length) utils.joinRoom(socket, namespace, target);
      }
    });

    socket.on('leaveRoom', data => {
      const targetRoom: socketInfo = utils.findRoom(socketData, socket.id);
      utils.updateDisconnectData(targetRoom, socketData, socket);
    });
  });
};

export { socketHandler, socketData };
