import { PlayList } from '../socket/music';

type Music = {
  MID: number;
  name: string;
  singer: string;
  description: string;
  thumbnail: string;
  path: string;
  isPlayed: boolean;
};

type socketInfo = {
  id: number;
  name: string;
  socketId: string[];
  description: string;
  playList: PlayList;
};

type userList = {
  [socketid: string]: number;
};

type musicTable = {
  MID: number;
  name: string;
  singer: string;
  description: string;
  thumbnail: string;
  path: string;
  content_hash: string;
};

export type { Music, socketInfo, userList, musicTable };
