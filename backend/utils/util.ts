import { Socket } from 'socket.io';
import { socketInfo } from '../types';
import { PlayList } from '../socket/music';
import { Server } from 'http';

export const utils = {
  findRoom: function (socketData: socketInfo[], socketID: string) {
    const target = socketData.find(
      val => val.socketId.some(client => client === socketID) === true,
    )!;

    return target;
  },

  updateList: function (socketData: socketInfo[], targetRoom: socketInfo) {
    socketData.splice(socketData.indexOf(targetRoom), 1);
    const data = socketData.map(val => {
      return { id: val.id, name: val.name, description: val.description };
    }); // utils로 기능 빼기
    return data;
  },

  updateDisconnectData: function (
    targetRoom: socketInfo,
    socketData: socketInfo[],
    socket: Socket,
  ) {
    if (targetRoom !== undefined) {
      targetRoom.socketId = targetRoom.socketId.filter(val => val !== socket.id);
      if (!targetRoom.socketId.length) {
        const updatedList = this.updateList(socketData, targetRoom);
        socket.broadcast.emit('updateRoomList', { list: updatedList });
      }
    }
  },

  findRoomMaster: function (socketData: socketInfo[], socketID: string) {
    return socketData.find(val => val.socketId[0] === socketID);
  },

  updateNewRoom: function (socketData: socketInfo[], socket: Socket, roomData: any) {
    socket.join(roomData.name);
    socketData.push({
      id: roomData.id,
      name: roomData.name,
      socketId: [socket.id],
      description: roomData.description,
      playList: new PlayList(),
    });
  },

  getRoomListForClient: function (socketData: socketInfo[]) {
    return socketData.map(val => {
      return { id: val.id, name: val.name, description: val.description };
    }); // utils로 기능 빼기
  },

  isRoomExist: function (socketData: socketInfo[], roomName: string) {
    return socketData.some(val => {
      return val.name === roomName;
    });
  },
  findRoomOnTitle: function (socketData: socketInfo[], roomName: string) {
    return socketData.find(val => val.name === roomName);
  },

  joinRoom: function (socket: Socket, namespace: any, target: socketInfo) {
    socket.broadcast.to([target.socketId[0]]).emit('requestTime', 'time');
    namespace
      .to(target.name)
      .emit('joinRoomClient', `${target.name} 입니다. 누군가가 입장했습니다.`);
  },
};
