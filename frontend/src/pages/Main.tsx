import React, { useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { useSocket } from '../context/MyContext';
import { useAsync } from '../hooks/useAsync';
import { RouteComponentProps } from 'react-router';
import { apiFetch, fadeOut } from '../hooks/utils';
import RoomItem from '../components/Main/RoomItem';
import '../stylesheets/main.scss';
import { fetchState, Room, joinData } from '../types';

export const MainPage = ({ history }: { history: RouteComponentProps['history'] }) => {
  const socket: Socket = useSocket()!;
  const alertRef: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const [state, fetchUser] = useAsync(apiFetch, 'room', []);
  const { loading, data: roomList, error } = state as fetchState;

  const userRedundancyModalBlink = (joinData: joinData) => {
    if (!joinData.isRedundancy) {
      history.push(`/room/${joinData.roomID}`);
    } else fadeOut(alertRef.current!);
  };

  useEffect(() => {
    socket.on('redundancyCheck', userRedundancyModalBlink);
    socket.on('routingAfterCreateRoom', (roomNumber: number) => {
      history.push(`/room/${roomNumber}`);
    });
    socket.on('updateRoomList', fetchUser);

    return () => {
      socket.off('redundancyCheck');
      socket.off('routingAfterCreateRoom');
      socket.off('updateRoomList');
    };
  }, []);

  return (
    <div className={'body'}>
      <div className="main-wrap">
        {roomList.length ? (
          <>
            <h2>방 참가하기</h2>
            <div className={'roomList'}>
              {roomList.map(val => (
                <RoomItem
                  id={val.id}
                  name={val.name}
                  description={val.description}
                  total={`${val.totalUser}명 접속 중`}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="room-empty-notice">
            <img src="/icons/no-room.svg" alt="Room list is empty!" />
            <p>열려 있는 방이 존재하지 않습니다!</p>
            <p className="room-empty-notice-detail">
              아직 만들어진 방이 없다면,
              <br />
              직접 방을 만들어 음악을 함께 하는 건 어떨까요?
            </p>
          </div>
        )}
        <div className={'delegate'} ref={alertRef}>
          이미 접속해 있는 방입니다.
        </div>
      </div>
    </div>
  );
};
