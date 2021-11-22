import React, { useEffect } from 'react';
import HeaderComponent from '../components/Header/Header';
import MusicPlayer from '../components/Room/MusicPlayer/MusicPlayer';
import PlayList from '../components/Room/PlayList/PlayList';
import ChatComponent from '../components/Room/Chat/chat';
import { useSocket } from '../context/MyContext';
import { RouteComponentProps } from 'react-router';

const Room = ({ history }: { history: RouteComponentProps['history'] }) => {
  const socket: any = useSocket();

  useEffect(() => {
    window.onpopstate = event => {
      socket.emit('leaveRoom');
    };

    window.onload = event => {
      const roomTitle = window.location.pathname.match(/[^/]+/gm)![1];
      socket.emit('joinRoom', roomTitle);
    };

    return () => {
      socket.off('leaveRoom');
    };
  });

  return (
    <>
      <HeaderComponent history={history} />
      <div className="room-wrap">
        <div>
          <MusicPlayer></MusicPlayer>
          <PlayList></PlayList>
        </div>
        <div>
          <div
            style={{
              width: '400px',
              height: '150px',
              backgroundColor: '#beaee2',
              color: '#f9f9f9',
              marginBottom: '1rem',
              padding: '1rem',
              boxSizing: 'border-box',
              borderRadius: '0.25rem',
            }}
          >
            <h3>참가자 5명</h3>
            <ul>
              <li>철수</li>
              <li>훈이</li>
              <li>맹구</li>
              <li>유리</li>
              <li>짱구</li>
            </ul>
          </div>
          <ChatComponent />
        </div>
      </div>
    </>
  );
};

export { Room };
