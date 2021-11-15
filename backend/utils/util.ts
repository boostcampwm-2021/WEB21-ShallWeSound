import { socketInfo } from '../types';
import crypto from 'crypto';


export function makeHash(fileBuffer:string):string{
  return crypto.createHash('sha512').update(fileBuffer + `${process.env.SALT}`).digest('hex');
}

export const utils = {
  findRoom: function (socketData: socketInfo[], socketID: string) {
    const target = socketData.find(
      val => val.socketId.some(client => client === socketID) === true,
    )!;

    return target;
  },
};
