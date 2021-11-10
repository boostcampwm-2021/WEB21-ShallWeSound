import React, { useState, useContext, useEffect, useRef, EventHandler } from 'react';
import { Socket } from 'socket.io-client';
import { useSocket } from '../context/MyContext';

export const MainPage = ({ history }: { history: any }) => {
  const socket: Socket = useSocket()!;

  const fff = (e: React.MouseEvent<HTMLElement>) => {
    socket.emit('joinRoom', e.currentTarget.innerHTML);
    console.log('joinRoom 이벤트 발생');
    history.push('/room');
  };

  useEffect(() => {
    socket.on('joinRoomClient', data => {
      console.log(data);
    });
  });

  return (
    <>
      <div>메인 인데요</div>
      <div className={'room'} onClick={fff}>
        최고다 아이유
      </div>
      <div className={'room'} onClick={fff}>
        최고다 이순신
      </div>
      <div className={'room'} onClick={fff}>
        최고다 김윈터
      </div>
    </>
  );
};
