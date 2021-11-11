import { listenerCount } from 'process';
import React, { useState, useContext, useEffect, useRef, EventHandler } from 'react';
import { Socket } from 'socket.io-client';
import { useSocket } from '../context/MyContext';
import '../stylesheets/main.scss';
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

  useEffect(() => {
    fetch('http://localhost:3000/api/room') // session 쓸때 credentials : 'include' 설정해주기
      .then(res => res.json())
      .then(data => {
        console.log(data.list);
        console.log('여기로 오나?');
      });
  }, []);

  return (
    <>
      <div className={'ssd'}>
        <div>메인 인데요</div>
        <div className={'roomList'}>
          {roomList.map((val, idx) => (
            <div className={'room'} onClick={fff} key={idx}>
              {val}
            </div>
          ))}
        </div>
        <input type={'button'} value={'방 추가'} onClick={리액트너무재밌는데}></input>
      </div>
    </>
  );
};
