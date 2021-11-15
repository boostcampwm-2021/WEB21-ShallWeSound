import { Server, Socket } from 'socket.io';
import { socketData, userHash } from './userData';
import { socketCB } from './socketCallBack';

import { PlayList } from './music';

// const playList = new PlayList();

interface socketInfo {
  id: number;
  name: string;
  socketId: string[];
  description: string;
  playList: PlayList;
}

const socketHandler = (io: Server) => {
  const namespace = io.of('/music');

  namespace.on('connection', socketCB.connection);
};

export { socketHandler, socketData };
