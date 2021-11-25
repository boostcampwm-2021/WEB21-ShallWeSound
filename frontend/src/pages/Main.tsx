import React, { useState, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { useSocket } from '../context/MyContext';
import config from '../config.host.json';
import { useAsync } from '../context/useAsync';
import { RouteComponentProps } from 'react-router';
import { Cookies } from 'react-cookie';

import '../stylesheets/main.scss';
import { fetchState, Room } from '../types';

export const MainPage = ({ history }: { history: RouteComponentProps['history'] }) => {
  const socket: Socket = useSocket()!;
  const cookies = new Cookies();
  const alertRef: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

  const listFetch = async () => {
    const result = await fetch(`${config.localhost}/api/room`, {
      credentials: 'include',
    });
    const res = await result.json();
    return res.list;
  };

  function Room({ id, name, description, total }: { id: string; name: string; description: string; total: string }) {
    const joinRoom = (e: React.MouseEvent<HTMLElement>) => {
      socket.emit('redundancyCheck', { userID: cookies.get('userID'), roomID: id });
    };

    return (
      <div className={'room'} onClick={joinRoom} key={id}>
        <p className="room-name">{name}</p>
        <p className="room-description">{description}</p>
        <p>{total}</p>
      </div>
    );
  }

  const [state, fetchUser] = useAsync(listFetch, []);
  const { loading, data: roomList, error } = state as fetchState;

  useEffect(() => {
    socket.on('joinRoomClient', data => {
      if (!data.isRedundancy) history.push(`/room/${data.roomID}`);
      else {
        alertRef.current!.style.opacity = '1';

        setTimeout(() => {
          if (alertRef.current) alertRef.current!.style.opacity = '0';
        }, 3000);
      }
    });

    socket.on('createRoomRoute', (roomNumber: number) => {
      history.push(`/room/${roomNumber}`);
    });

    socket.on('updateRoomList', data => {
      fetchUser();
    });

    return () => {
      socket.off('joinRoomClient');
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
                <Room id={val.id} name={val.name} description={val.description} total={`${val.totalUser}명 접속 중`} />
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
