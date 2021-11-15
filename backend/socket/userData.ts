import { PlayList } from './music';

interface userList {
  [socketid: string]: number;
}

interface socketInfo {
  id: number;
  name: string;
  socketId: string[];
  description: string;
  playList: PlayList;
}

const userHash: userList = {};

let socketData: socketInfo[] = [];

export { userHash, socketData, socketInfo };
