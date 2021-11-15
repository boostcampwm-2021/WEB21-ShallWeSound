import React, { useState, useEffect } from 'react';
import MusicPlayer from '../components/Room/MusicPlayer/MusicPlayer';
import PlayList from '../components/Room/PlayList/PlayList';
import ChatComponent from '../components/Room/Chat/chat';
import styled from 'styled-components';
import { useSocket } from '../context/MyContext';
import { Socket } from 'socket.io-client';

const Room = () => {
  const socket: any = useSocket();

  interface musicInfo {
    name: string;
    singer: string;
    thumbnail: string;
    src: string;
  }

  useEffect(() => {
    window.onpopstate = event => {
      socket.emit('leaveRoom', 'data');
    };

    return () => {
      socket.off('leaveRoom');
    };
  });

  const [musicList, setMusicList] = useState<musicInfo[]>([
    {
      name: 'Harley Bird - Home',
      singer: 'Jordan Schor',
      thumbnail: '/images/music-1.jpg',
      src: '/songs/music-1.mp3',
    },
    {
      name: 'Ikson Anywhere – Ikson',
      singer: 'Audio Library',
      thumbnail: '/images/music-2.jpg',
      src: '/songs/music-2.mp3',
    },
    {
      name: 'Beauz & Jvna - Crazy',
      singer: 'Beauz & Jvna',
      thumbnail: '/images/music-3.jpg',
      src: '/songs/music-3.mp3',
    },
    {
      name: 'Hardwind - Want Me',
      singer: 'Mike Archangelo',
      thumbnail: '/images/music-4.jpg',
      src: '/songs/music-4.mp3',
    },
    {
      name: 'Jim - Sun Goes Down',
      singer: 'Jim Yosef x Roy',
      thumbnail: '/images/music-5.jpg',
      src: '/songs/music-5.mp3',
    },
    {
      name: 'Lost Sky - Vision NCS',
      singer: 'NCS Release',
      thumbnail: '/images/music-6.jpg',
      src: '/songs/music-6.mp3',
    },
  ]);

  return (
    <>
      <div>
        <MusicPlayer musicList={musicList}></MusicPlayer>
        <ChatComponent />
      </div>
      <StyledDiv>
        <PlayList></PlayList>
        {/* <Video /> */}
      </StyledDiv>
    </>
  );
};

const StyledDiv = styled.div`
  /* width: 100vw; 
  height: 100vh; */
`;

export { Room };
