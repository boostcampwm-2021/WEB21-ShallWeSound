import React, { useEffect } from 'react';
import MusicPlayer from '../components/Room/MusicPlayer/MusicPlayer';
import PlayList from '../components/Room/PlayList/PlayList';
import ChatComponent from '../components/Room/Chat/chat';
import styled from 'styled-components';
import { useSocket } from '../context/MyContext';

const Room = () => {
  const socket: any = useSocket();

  useEffect(() => {
    window.onpopstate = event => {
      socket.emit('leaveRoom');
    };

    window.onload = event => {};

    return () => {
      socket.off('leaveRoom');
    };
  });

  return (
    <>
      <div>
        <MusicPlayer></MusicPlayer>
        <ChatComponent />
      </div>
      <StyledDiv>
        <PlayList></PlayList>
      </StyledDiv>
    </>
  );
};

const StyledDiv = styled.div`
  /* width: 100vw; 
  height: 100vh; */
`;

export { Room };
