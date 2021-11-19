import { createContext, useContext } from 'react';
import io from 'socket.io-client';
import config from '../config.host.json';

const socket: any = io(`${config.localhost}/music`);
const SocketContext = createContext(null);

const ContextProvider = ({ children }: { children: any }) => {
  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

const useSocket = () => useContext(SocketContext);

export { ContextProvider, useSocket };
