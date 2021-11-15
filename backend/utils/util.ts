import { socketInfo } from '../types';

export const utils = {
  findRoom: function (socketData: socketInfo[], socketID: string) {
    const target = socketData.find(
      val => val.socketId.some(client => client === socketID) === true,
    )!;

    return target;
  },
};
