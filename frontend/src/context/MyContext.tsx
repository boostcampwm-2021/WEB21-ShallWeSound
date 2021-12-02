import { createContext, ReactElement, useContext } from 'react';
import io, { Socket } from 'socket.io-client';
import config from '../config.host.json';

const socket: Socket = io(`${config.localhost}/music`);
const SocketContext = createContext(socket);

const ContextProvider = ({ children }: { children: ReactElement }) => {
  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

const useSocket = () => useContext(SocketContext);

export { ContextProvider, useSocket };
