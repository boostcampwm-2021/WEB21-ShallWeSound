import React, { useEffect, useState } from 'react';
import HeaderComponent from '../components/Header/Header';
import MusicPlayer from '../components/Room/MusicPlayer/MusicPlayer';
import PlayList from '../components/Room/PlayList/PlayList';
import ChatComponent from '../components/Room/Chat/chat';
import UserList from '../components/Room/UserList/UserList';
import { useSocket } from '../context/MyContext';
import config from '../config.host.json';
import { RouteComponentProps } from 'react-router';

const Room = ({ history }: { history: RouteComponentProps['history'] }) => {
  const socket: any = useSocket();

  const roomData = window.location.pathname.match(/[^/]+/gm)![1];
  const [isHost, setIsHost] = useState<boolean>(false);
  const [userList, setUserList] = useState<string[]>([]);

  useEffect(() => {
    window.onpopstate = event => {
      socket.emit('leaveRoom');
    };

    window.onload = event => {
      const roomTitle = window.location.pathname.match(/[^/]+/gm)![1];
      socket.emit('joinRoom', roomTitle);
    };

    console.log(socket.id);

    return () => {
      socket.off('leaveRoom');
    };
  }, []);

  useEffect(() => {
    fetch(`${config.localhost}/api/userList?roomTitle=${roomData}`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        setUserList(data.list);
        if (userList[0] === socket.id) setIsHost(true);
      });
  });

  return (
    <>
      <HeaderComponent history={history} />
      <div className="room-wrap">
        <div>
          <MusicPlayer isHost={isHost}></MusicPlayer>
          <PlayList isHost={isHost}></PlayList>
        </div>
        <div>
          <UserList user={userList} />
          <ChatComponent />
        </div>
      </div>
    </>
  );
};

export { Room };
