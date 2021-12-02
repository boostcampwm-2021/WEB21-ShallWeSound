import React, { useEffect, useState, useRef } from 'react';
import '../stylesheets/main.scss';
import MusicPlayer from '../components/Room/MusicPlayer/MusicPlayer';
import PlayList from '../components/Room/PlayList/PlayList';
import ChatComponent from '../components/Room/Chat/ChatComponent';
import UserList from '../components/Room/UserList/UserList';
import { useSocket } from '../context/MyContext';
import { useAsync } from '../hooks/useAsync';
import { RouteComponentProps } from 'react-router';
import { fetchState } from '../types';
import { Cookies } from 'react-cookie';
import { apiFetch, fadeOut } from '../hooks/utils';
import { Socket } from 'socket.io-client';

const Room = ({ history }: { history: RouteComponentProps['history'] }) => {
  const socket: Socket = useSocket()!;
  const cookie = new Cookies();
  const alertRef: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const roomData = decodeURI(history.location.pathname.match(/[^/]+/gm)![1]).toString();
  const [isHost, setIsHost] = useState<boolean>(false);
  const [state, refetchUserList] = useAsync(apiFetch, `userList?roomTitle=${roomData}`, []);
  const { data: userList } = state as fetchState;

  const hostDelegated = (isHostServer: boolean) => {
    setIsHost(isHostServer);
    fadeOut(alertRef.current!);
  };

  useEffect(() => {
    window.onpopstate = event => {
      socket.emit('leaveRoom');
    };
    socket.emit('joinRoom', { roomID: roomData, userID: cookie.get('userID') });

    socket.on('updateUserList', refetchUserList);
    socket.on('delegateHost', hostDelegated);

    return () => {
      socket.off('updateUserList');
      socket.off('delegateHost');
    };
  }, []);

  useEffect(() => {
    if (userList[0] === cookie.get('userID')) setIsHost(true);
  }, [userList]);

  if (userList[0] === 'bad') {
    return <div>잘못된 요청입니다.</div>;
  }

  return (
    <div className="room-wrap">
      <div className="room-wrap-left">
        <MusicPlayer isHost={isHost}></MusicPlayer>
        <PlayList isHost={isHost}></PlayList>
      </div>
      <div className="room-wrap-right">
        <UserList user={userList} isHost={isHost} />
        <ChatComponent />
      </div>

      <div className={'delegate'} ref={alertRef}>
        방장 권한이 위임 되었습니다.
      </div>
    </div>
  );
};

export { Room };
