import React, { useEffect, useState, useRef, ReactComponentElement } from 'react';
import '../stylesheets/main.scss';
import MusicPlayer from '../components/Room/MusicPlayer/MusicPlayer';
import PlayList from '../components/Room/PlayList/PlayList';
import ChatComponent from '../components/Room/Chat/chat';
import UserList from '../components/Room/UserList/UserList';
import { useSocket } from '../context/MyContext';
import { useAsync } from '../context/useAsync';
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
  const { loading, data: userList, error } = state as fetchState;

  const hostDelegated = (isHostServer: boolean) => {
    setIsHost(isHostServer);
    fadeOut(alertRef.current!);
  };

  useEffect(() => {
    window.onpopstate = event => {
      socket.emit('leaveRoom');
    };
    socket.emit('joinRoom', { roomID: roomData, userID: cookie.get('userID') });
  }, []);

  useEffect(() => {
    if (userList[0] === cookie.get('userID')) setIsHost(true);
  }, [userList]);

  useEffect(() => {
    socket.on('updateUserList', refetchUserList);
    socket.on('delegateHost', hostDelegated);

    return () => {
      socket.off('updateUserList');
      socket.off('delegateHost');
    };
  }, []);

  if (userList[0] === 'bad') {
    return <div>잘못된 요청입니다.</div>;
  }

  return (
    <div className="room-wrap">
      <div>
        <MusicPlayer isHost={isHost}></MusicPlayer>
        <PlayList isHost={isHost}></PlayList>
      </div>
      <div>
        <UserList user={userList} />
        <ChatComponent />
      </div>

      <div className={'delegate'} ref={alertRef}>
        방장 권한이 위임 되었습니다.
      </div>
    </div>
  );
};

export { Room };
