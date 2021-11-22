import React, { useEffect, useState } from 'react';
import HeaderComponent from '../components/Header/Header';
import MusicPlayer from '../components/Room/MusicPlayer/MusicPlayer';
import PlayList from '../components/Room/PlayList/PlayList';
import ChatComponent from '../components/Room/Chat/chat';
import UserList from '../components/Room/UserList/UserList';
import { useSocket } from '../context/MyContext';
import config from '../config.host.json';
import { useAsync } from '../context/useAsync';
import { RouteComponentProps } from 'react-router';
import { fetchState } from '../types';

const Room = ({ history }: { history: RouteComponentProps['history'] }) => {
  const socket: any = useSocket();

  const roomData = window.location.pathname.match(/[^/]+/gm)![1];
  const [isHost, setIsHost] = useState<boolean>(false);

  const fetchUserList = async () => {
    const data = await fetch(`${config.localhost}/api/userList?roomTitle=${roomData}`, {
      credentials: 'include',
    });
    const result = await data.json();

    return result.list;
  };

  const [state, refetchUserList] = useAsync(fetchUserList, []);
  const { loading, data: userList, error } = state as fetchState;

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
  }, []);

  useEffect(() => {
    if (socket.id !== undefined && userList[0] === socket.id) setIsHost(true);

    socket.on('updateUserList', () => {
      refetchUserList();
    });

    socket.on('delegateHost', (isHostServer: boolean) => {
      console.log('위임받기');
      setIsHost(isHostServer);
    });

    return () => {
      socket.off('updateUserList');
      socket.off('delegateHost');
    };
  }, []);

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
