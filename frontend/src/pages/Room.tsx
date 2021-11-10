import React, { useState, useContext } from 'react';
import MusicPlayer from '../components/MusicPlayer';
import styled from 'styled-components';
import io from 'socket.io-client';
import PlayList from '../components/PlayList';
import ChatComponent from '../components/chat';
import Modal from '../components/Modal';
import { localhost } from '../config.host.json';

const socket: any = io(`${localhost}/music`);

const SocketProvider = React.createContext(null);

const Room = () => {
  interface musicInfo {
    name: string;
    singer: string;
    thumbnail: string;
    src: string;
  }

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
      <SocketProvider.Provider value={socket}>
        <div>
          <MusicPlayer musicList={musicList}></MusicPlayer>
          <ChatComponent />
        </div>
        <PlayList></PlayList>
        <Modal width="350px" height="650px">
          <div></div>
        </Modal>
      </SocketProvider.Provider>
    </>
  );
};

const useSocket = () => useContext(SocketProvider);

export { Room, useSocket };
