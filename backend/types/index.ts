import { PlayList } from '../socket/music';

type authCode = string | qs.ParsedQs | string[] | qs.ParsedQs[] | undefined;

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
  id: string;
  name: string;
  socketId: string[];
  userId: string[];
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

export type { Music, socketInfo, userList, musicTable, authCode };
