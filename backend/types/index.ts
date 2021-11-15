import { PlayList } from '../socket/music';

type Music = {
  MID: number;
  title: string;
  src: string;
  isPlayed: boolean;
  singer: string;
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

export type { Music, socketInfo, userList };
