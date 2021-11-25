import { Server, Socket } from 'socket.io';
import { socketData, userHash } from './userData';
import { PlayList } from './music';
import musicService from '../services/music';
import { utils } from '../utils/util';
import type { Music, socketInfo } from '../types';

// const playList = new PlayList();
let userNum: number = 0;
let roomNumber: number = 1;

const socketHandler = (io: Server) => {
  const namespace = io.of('/music');

  namespace.on('connection', socket => {
    console.log('접속 중: ', socket.id);
    userHash[socket.id] = userNum;
    userNum += 1;

    socket.broadcast.emit('enterRoom', 'new user connected');

    socket.on('disconnect', () => {
      const targetRoom: socketInfo = utils.findRoom(socketData, socket.id);
      const leaveUser = targetRoom?.socketId[0];
      utils.updateDisconnectData(targetRoom, socketData, socket);

      if (targetRoom && targetRoom.socketId.length > 0) {
        if (leaveUser === socket.id) {
          namespace.to(targetRoom.socketId[0]).emit('delegateHost', true);
        }

        namespace.to(targetRoom.id).emit('updateUserList');
        const roomList = utils.getRoomListForClient(socketData);
        socket.broadcast.emit('updateRoomList', { list: roomList });
      }
    });

    socket.on('chatMessage', (message: string) => {
      const targetRoom: socketInfo = utils.findRoom(socketData, socket.id);
      if (targetRoom !== undefined)
        socket.to(targetRoom.id).emit('chatMessage', { id: userHash[socket.id], msg: message });
    });

    socket.on('responseTime', (data: number) => {
      const targetRoom: socketInfo = utils.findRoom(socketData, socket.id);
      socket.broadcast.to(targetRoom.id).emit('sync', data);
      namespace.to(targetRoom.id).emit('changeMusicInfo', targetRoom.playList.getCurrentMusic());
    });

    socket.on('pause', (data: string) => {
      const targetRoom = utils.findRoomMaster(socketData, socket.id);
      if (targetRoom !== undefined) socket.to(targetRoom.id).emit('clientPause', '멈춰!');
    });

    socket.on('play', (data: string) => {
      const targetRoomTemp: socketInfo = utils.findRoom(socketData, socket.id);
      const targetRoom = utils.findRoomMaster(socketData, socket.id);
      utils.joinRoom(socket, namespace, targetRoomTemp);
      if (targetRoom !== undefined) socket.to(targetRoom.id).emit('clientPlay', '시작해!');
    });

    socket.on('moving', (data: string) => {
      const targetRoom = utils.findRoomMaster(socketData, socket.id);
      if (targetRoom !== undefined) socket.to(targetRoom.id).emit('clientMoving', data);
    });

    socket.on('requestPlayList', () => {
      const targetRoom: socketInfo = utils.findRoom(socketData, socket.id);
      const res = targetRoom?.playList.getPlayList() ?? [];
      namespace.to(socket.id).emit('responsePlayList', res);
    });

    socket.on('nextMusicReq', () => {
      const targetRoom: socketInfo = utils.findRoom(socketData, socket.id);
      if (socket.id !== targetRoom?.socketId[0]) return;
      // next Music Response
      namespace.to(targetRoom.id).emit('changeMusicInfo', targetRoom.playList.getNextMusic());
      // socket.to(targetRoom.id).emit('clientPlay', src);
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
      if (!targetRoom) {
        return;
      }

      const musics: Music[] = await musicService.findMusicsBy(MIDS);
      if (targetRoom.playList.isExist(musics)) {
        namespace.to(socket.id).emit('duplicatedMusicInPlayList');
        return;
      }
      targetRoom.playList.addMusics(musics);
      namespace.to(socket.id).emit('successAddMusic');

      const list = targetRoom?.playList.getPlayList();
      namespace.to(targetRoom.id).emit('responsePlayList', list);

      if (list.length === musics.length) {
        list[0].isPlayed = true;
        namespace.to(targetRoom.id).emit('changeMusicInfo', list[0]);
      }
    });

    socket.on('removeMusicInPlayListReq', (MID: number) => {
      const targetRoom = socketData.find(val => val.socketId.some(client => client === socket.id) === true);
      if (!targetRoom) return;

      targetRoom.playList.removeMusicByMID(MID);

      const res = targetRoom.playList.getPlayList();
      namespace.to(targetRoom.id).emit('responsePlayList', res);
    });

    socket.on('createRoom', data => {
      utils.updateNewRoom(socketData, socket, data, roomNumber.toString());
      namespace.to(socket.id).emit('createRoomRoute', roomNumber.toString());
      roomNumber++;
    });

    socket.on('joinRoom', roomInfo => {
      socket.join(roomInfo.roomID);
      if (utils.isRoomExist(socketData, roomInfo.roomID)) {
        const target = utils.findRoomOnTitle(socketData, roomInfo.roomID);
        target?.socketId.push(socket.id);
        target?.userId.push(roomInfo.userID);
        // else {
        //   namespace.to(socket.id).emit('delegateHost', true);
        // }
        if (target?.socketId.length) utils.joinRoom(socket, namespace, target);
        namespace.to(target?.id!).emit('updateUserList');
        const roomList = utils.getRoomListForClient(socketData);
        socket.broadcast.emit('updateRoomList', { list: roomList });
      }
    });

    socket.on('leaveRoom', data => {
      const targetRoom: socketInfo = utils.findRoom(socketData, socket.id);
      const leaveUser = targetRoom?.socketId[0];
      utils.updateDisconnectData(targetRoom, socketData, socket);

      if (targetRoom !== undefined) {
        if (leaveUser === socket.id) namespace.to(targetRoom.socketId[0]).emit('delegateHost', true);

        namespace.to(targetRoom.id).emit('updateUserList');
        const roomList = utils.getRoomListForClient(socketData);
        socket.broadcast.emit('updateRoomList', { list: roomList });
      }
    });

    socket.on('clickAndPlayMusic', (clickedMusic: string) => {
      const targetRoom = utils.findRoom(socketData, socket.id);
      const targetPlayList = targetRoom.playList;
      targetPlayList.setIsPlayed(false, targetPlayList.getCurrentMusic().name);
      targetPlayList.setIsPlayed(true, clickedMusic);
      namespace.to(targetRoom.id).emit('changeMusicInfo', targetPlayList.getMusicByName(clickedMusic));
    });

    socket.on('zzz', data => {
      console.log(data);
    });
  });
};

export { socketHandler, socketData };
