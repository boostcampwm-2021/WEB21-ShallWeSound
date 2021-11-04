import React, { useContext } from 'react';
import styled from 'styled-components';
import io from 'socket.io-client';
import PlayList from '../components/PlayList';
import Video from '../components/video';

const socket: any = io('http://localhost:3000/music');
const SocketProvider = React.createContext(null);

const Room = () => {
  return (
    <SocketProvider.Provider value={socket}>
      <StyledDiv>
        <PlayList></PlayList>
        {/* <Video /> */}
      </StyledDiv>
    </SocketProvider.Provider>
  );
};

const StyledDiv = styled.div`
  /* width: 100vw; */
  /* height: 100vh; */
`;

const useSocket = () => useContext(SocketProvider);

export { Room, useSocket };
