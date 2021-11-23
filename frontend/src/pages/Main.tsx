import React, { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { useSocket } from '../context/MyContext';
import config from '../config.host.json';
import { useAsync } from '../context/useAsync';
import { RouteComponentProps } from 'react-router';

import '../stylesheets/main.scss';
import { fetchState } from '../types';

export const MainPage = ({ history }: { history: RouteComponentProps['history'] }) => {
  const socket: Socket = useSocket()!;
  
  const listFetch = async () => {
    const result = await fetch(`${config.localhost}/api/room`, {
      credentials: 'include',
    });
    const res = await result.json();
    return res.list;
  };
  
  function Room({ id, name, description }: { id: number; name: string; description: string }) {
    const joinRoom = (e: React.MouseEvent<HTMLElement>) => {
      socket.emit('joinRoom', name);
      history.push(`/room/${name}`);
    };
    
    return (
      <div className={'room'} onClick={joinRoom} key={id}>
        <p className="room-name">{name}</p>
        <p className="room-description">{description}</p>
      </div>
    );
  }

  const [state, fetchUser] = useAsync(listFetch, []);
  const { loading, data: roomList, error } = state as fetchState;

  useEffect(() => {
    socket.on('joinRoomClient', data => {
      console.log(data);
    });

    socket.on('updateRoomList', data => {
      console.log('업데이트리스트');
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
            {roomList.map(val => <Room id={val.id} name={val.name} description={val.description} />)}
          </div>
        </>
        ) : (
          <div className="room-empty-notice">
            <img src="/icons/no-room.svg" alt="Room list is empty!" />
            <p>열려 있는 방이 존재하지 않습니다!</p>
            <p className="room-empty-notice-detail">아직 만들어진 방이 없다면,<br/>직접 방을 만들어 음악을 함께 하는 건 어떨까요?</p>
          </div>
        )}
      </div>
    </div>
  );
};
