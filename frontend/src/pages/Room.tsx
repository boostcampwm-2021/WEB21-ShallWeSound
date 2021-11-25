import React, { useEffect, useState, useRef, ReactComponentElement } from 'react';
import '../stylesheets/main.scss';
import MusicPlayer from '../components/Room/MusicPlayer/MusicPlayer';
import PlayList from '../components/Room/PlayList/PlayList';
import ChatComponent from '../components/Room/Chat/chat';
import UserList from '../components/Room/UserList/UserList';
import { useSocket } from '../context/MyContext';
import config from '../config.host.json';
import { useAsync } from '../context/useAsync';
import { RouteComponentProps } from 'react-router';
import { fetchState } from '../types';
import { Cookies } from 'react-cookie';

const Room = ({ history }: { history: RouteComponentProps['history'] }) => {
  const socket: any = useSocket();
  const alertRef: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const roomData = decodeURI(window.location.pathname.match(/[^/]+/gm)![1]).toString();

  const [isHost, setIsHost] = useState<boolean>(false);

  const fetchUserList = async () => {
    const data = await fetch(`${config.localhost}/api/userList?roomTitle=${roomData}`, {
      credentials: 'include',
    });
    const result = await data.json();

    return result.list;
  };

  const cookie = new Cookies();

  const [state, refetchUserList] = useAsync(fetchUserList, []);
  const { loading, data: userList, error } = state as fetchState;

  useEffect(() => {
    window.onpopstate = event => {
      socket.emit('leaveRoom');
    };

    socket.emit('joinRoom', { roomID: roomData, userID: cookie.get('userID') });

    return () => {
      socket.off('leaveRoom');
      socket.off('joinRoom');
    };
  }, []);

  useEffect(() => {
    if (userList[0] === cookie.get('userID')) setIsHost(true);
  }, [userList]);

  useEffect(() => {
    socket.on('updateUserList', () => {
      refetchUserList();
    });

    socket.on('delegateHost', (isHostServer: boolean) => {
      setIsHost(isHostServer);
      alertRef.current!.style.opacity = '1';

      setTimeout(() => {
        if (alertRef.current) alertRef.current!.style.opacity = '0';
      }, 3000);
    });

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
