import { listenerCount } from 'process';
import React, { useState, useContext, useEffect, useRef, EventHandler } from 'react';
import { Socket } from 'socket.io-client';
import { useSocket } from '../context/MyContext';
import './Main.scss';

import { Room } from './Room';

export const MainPage = ({ history }: { history: any }) => {
  const socket: Socket = useSocket()!;

  const [roomList, setRoomList] = useState([
    '$$최고다 아이유 너만 오면고$$',
    '$$최고다 이순신 입장시 불멸!$$',
    '$$최고다 김윈터 ㄷㄷㄷㄷㄷㄷ$$',
  ]);

  const fff = (e: React.MouseEvent<HTMLElement>) => {
    socket.emit('joinRoom', e.currentTarget.innerHTML);
    console.log('joinRoom 이벤트 발생');
    history.push('/room');
  };

  const 리액트너무재밌는데 = () => {
    setRoomList([...roomList, '방을 추가해보자']);
  };

  useEffect(() => {
    socket.on('joinRoomClient', data => {
      console.log(data);
    });
  });

  return (
    <>
      <div>메인 인데요</div>
      <div className={'roomList'}>
        {roomList.map(val => (
          <div className={'room'} onClick={fff}>
            {val}
          </div>
        ))}
      </div>
      <input type={'button'} value={'방 추가'} onClick={리액트너무재밌는데}></input>
    </>
  );
};
