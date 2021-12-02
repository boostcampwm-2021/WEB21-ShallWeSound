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
    return (
      <div className="main-wrap room-empty-notice">
        <svg xmlns="http://www.w3.org/2000/svg" height="10rem" viewBox="0 0 24 24" width="10rem" fill="#beaee2">
          <path d="M0 0h24v24H0V0z" fill="none" opacity=".87"/>
          <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.59-13L12 10.59 8.41 7 7 8.41 10.59 12 7 15.59 8.41 17 12 13.41 15.59 17 17 15.59 13.41 12 17 8.41z"/></svg>
        <h2 className="text-center">잘못된 요청입니다.</h2>
      </div>
    );
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
