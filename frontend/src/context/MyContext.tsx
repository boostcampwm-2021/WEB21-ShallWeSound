import { createContext, useContext, useReducer, useRef, useState } from 'react';
import io from 'socket.io-client';

const socket: any = io('http://localhost:3000/music', { reconnection: false });
const SocketContext = createContext(null);

const ContextProvider = ({ children }: { children: any }) => {
  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

const useSocket = () => useContext(SocketContext);

export { ContextProvider, useSocket };
