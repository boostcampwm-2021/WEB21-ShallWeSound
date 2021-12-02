import { Socket } from 'socket.io';
import { socketInfo } from '../types';
import { PlayList } from '../socket/music';
import { Server } from 'http';
import crypto from 'crypto';

export function makeHash(fileBuffer: string): string {
  return crypto
    .createHash('sha512')
    .update(fileBuffer + `${process.env.SALT}`)
    .digest('hex');
}

export const utils = {
  findRoom: function (socketData: socketInfo[], socketID: string) {
    const target = socketData.find(val => val.socketId.some(client => client === socketID) === true)!;

    return target;
  },

  updateList: function (socketData: socketInfo[], targetRoom: socketInfo) {
    socketData.splice(socketData.indexOf(targetRoom), 1);
    const data = socketData.map(val => {
      return { id: val.id, name: val.name, description: val.description };
    }); // utils로 기능 빼기
    return data;
  },

  updateDisconnectData: function (targetRoom: socketInfo, socketData: socketInfo[], socket: Socket) {
    if (targetRoom !== undefined) {
      const targetIdx = targetRoom.socketId.indexOf(socket.id);
      targetRoom.socketId = targetRoom.socketId.filter(val => val !== socket.id);
      targetRoom.userId = targetRoom.userId.filter((val, idx) => idx !== targetIdx);
      if (!targetRoom.socketId.length) {
        const updatedList = this.updateList(socketData, targetRoom);
        socket.broadcast.emit('updateRoomList', { list: updatedList });
      }
    }
  },

  findRoomMaster: function (socketData: socketInfo[], socketID: string) {
    return socketData.find(val => val.socketId[0] === socketID);
  },

  updateNewRoom: function (socketData: socketInfo[], socket: Socket, roomData: any, roomID: string) {
    socketData.push({
      id: roomID,
      name: roomData.name,
      socketId: [],
      userId: [],
      description: roomData.description,
      playList: new PlayList(),
    });
  },

  getRoomListForClient: function (socketData: socketInfo[]) {
    return socketData.map(val => {
      return { id: val.id, name: val.name, description: val.description, totalUesr: val.socketId.length };
    }); // utils로 기능 빼기
  },

  isRoomExist: function (socketData: socketInfo[], roomName: string) {
    return socketData.some(val => {
      return val.id === roomName;
    });
  },
  findRoomOnTitle: function (socketData: socketInfo[], roomName: string) {
    return socketData.find(val => val.id === roomName);
  },

  joinRoom: function (socket: Socket, namespace: any, target: socketInfo) {
    socket.broadcast.to([target.socketId[0]]).emit('requestTime', 'time');
  },

  getUserBySocketID: function (targetRoom: socketInfo, socketID: string) {
    const targetIdx = targetRoom.socketId.indexOf(socketID);
    return targetRoom.userId[targetIdx];
  },

  delegateHost: function (targetRoom: socketInfo, userName: string, socketID: string, namespace: any) {
    const targetSocket = this.findSocketIDByUserName(targetRoom, userName);
    targetRoom.socketId = [targetSocket, ...targetRoom.socketId.filter(val => val !== targetSocket)];
    targetRoom.userId = [userName, ...targetRoom.userId.filter(val => val !== userName)];
    namespace.to(targetRoom.id).emit('updateUserList');
    namespace.to(socketID).emit('delegateHost', false);
    namespace.to(targetSocket).emit('delegateHost', true);
  },

  findSocketIDByUserName: function (targetRoom: socketInfo, userName: string) {
    const idx = targetRoom.userId.indexOf(userName);
    const targetSocket = targetRoom.socketId[idx];
    return targetSocket;
  },
};
