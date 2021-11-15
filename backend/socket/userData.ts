import { PlayList } from './music';
import { socketInfo, userList } from '../types';

const userHash: userList = {};

let socketData: socketInfo[] = [];

export { userHash, socketData, socketInfo };
