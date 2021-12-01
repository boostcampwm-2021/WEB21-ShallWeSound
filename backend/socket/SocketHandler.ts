import { Server, Socket } from 'socket.io';
import { socketData, userHash } from './userData';
import { PlayList } from './music';
import musicService from '../services/music';
import { utils } from '../utils/util';
import type { Music, socketInfo } from '../types';

let userNum: number = 0;
let roomNumber: number = 1;

const socketHandler = (io: Server) => {
  const namespace = io.of('/music');

  namespace.on('connection', (socket: Socket) => {
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
      const userID = utils.getUserBySocketID(targetRoom, socket.id);
      if (targetRoom !== undefined) socket.to(targetRoom.id).emit('chatMessage', { id: userID, msg: message });
    });

    socket.on('responseTime', (currentPlayTime: number) => {
      const targetRoom: socketInfo = utils.findRoom(socketData, socket.id);
      socket.broadcast.to(targetRoom.id).emit('sync', currentPlayTime);
      namespace.to(targetRoom.id).emit('changeMusicInfo', targetRoom.playList.getCurrentMusic());
      namespace.to(targetRoom.id).emit('responsePlayList', targetRoom.playList.getPlayList());
    });

    socket.on('playControl', playType => {
      const targetRoom = utils.findRoomMaster(socketData, socket.id);
      if (playType === 'play') {
        const targetRoomTemp: socketInfo = utils.findRoom(socketData, socket.id);
        utils.joinRoom(socket, namespace, targetRoomTemp);
      }
      if (targetRoom !== undefined) socket.to(targetRoom.id).emit('playControl', playType);
    });

    socket.on('nextMusicReq', () => {
      const targetRoom: socketInfo = utils.findRoom(socketData, socket.id);
      if (socket.id !== targetRoom?.socketId[0]) return;
      namespace.to(targetRoom.id).emit('changeMusicInfo', targetRoom.playList.getNextMusic());
    });

    socket.on('currentMusicReq', () => {
      const targetRoom: socketInfo = utils.findRoom(socketData, socket.id);
      socket.emit('currentMusicRes', targetRoom?.playList.getCurrentMusic());
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
      namespace.to(socket.id).emit('routingAfterCreateRoom', roomNumber.toString());
      roomNumber++;
    });

    socket.on('joinRoom', roomInfo => {
      socket.join(roomInfo.roomID);
      if (utils.isRoomExist(socketData, roomInfo.roomID)) {
        const target = utils.findRoomOnTitle(socketData, roomInfo.roomID);
        target?.socketId.push(socket.id);
        target?.userId.push(roomInfo.userID);
        if (target?.socketId.length) utils.joinRoom(socket, namespace, target);
        namespace.to(target?.id!).emit('updateUserList');
        socket.broadcast.emit('updateRoomList');
      }
    });

    socket.on('leaveRoom', () => {
      const targetRoom: socketInfo = utils.findRoom(socketData, socket.id);
      const leaveUser = targetRoom?.socketId[0];
      utils.updateDisconnectData(targetRoom, socketData, socket);

      if (targetRoom !== undefined) {
        if (leaveUser === socket.id) namespace.to(targetRoom.socketId[0]).emit('delegateHost', true);
        namespace.to(targetRoom.id).emit('updateUserList');
        socket.leave(targetRoom.id);
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

    socket.on('redundancyCheck', userInfo => {
      const targetRoom: socketInfo = utils.findRoomOnTitle(socketData, userInfo.roomID)!;
      const isRedundancy = targetRoom.userId.some(val => val === userInfo.userID);
      socket.emit('redundancyCheck', { isRedundancy: isRedundancy, roomID: userInfo.roomID });
    });

    socket.on('delegateManual', (userName: string) => {
      const targetRoom: socketInfo = utils.findRoom(socketData, socket.id);
      const idx = targetRoom.userId.indexOf(userName);
      const targetSocket = targetRoom.socketId[idx];
      targetRoom.socketId = [
        targetRoom.socketId[idx],
        ...targetRoom.socketId.filter((val, idxs, arr) => val !== arr[idx]),
      ];
      targetRoom.userId = [userName, ...targetRoom.userId.filter(val => val !== userName)];
      namespace.to(targetRoom.id).emit('updateUserList');
      namespace.to(socket.id).emit('delegateHost', false);
      namespace.to(targetSocket).emit('delegateHost', true);
    });
  });
};

export { socketHandler, socketData };
