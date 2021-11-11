import { listenerCount } from 'process';
import React, { useState, useContext, useEffect, useRef, EventHandler } from 'react';
import styled, { css, keyframes } from 'styled-components';
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
  const [visible, setVisible] = useState(false);
  const [appear, setAppear] = useState(false);
  const [dialogInput, setDialogInput] = useState({
    name: "",
    description: "",
  })


  const fff = (e: React.MouseEvent<HTMLElement>) => {
    socket.emit('joinRoom', e.currentTarget.innerHTML);
    console.log('joinRoom 이벤트 발생');
    history.push('/room');
  };

  // const 리액트너무재밌는데 = () => {
  //   setRoomList([...roomList, '방을 추가해보자']);
  // };

  useEffect(() => {
    socket.on('joinRoomClient', data => {
      console.log(data);
    });
  });

  function changeDialogRoomName(e: React.BaseSyntheticEvent) {
    setDialogInput({
      ...dialogInput,
      name: e.target.value
    })
  }

  function changeDialogRoomDescription(e: React.BaseSyntheticEvent) {
    setDialogInput({
      ...dialogInput,
      description: e.target.value
    })
  }

  function toggleCreateRoomDialog() {
    setVisible(!visible);
  }

  function createRoom() {
    if (dialogInput.name && dialogInput.description) {
      fetch('http://localhost:3000/api/room') // session 쓸때 credentials : 'include' 설정해주기
      .then(res => res.json())
      .then(data => {
        console.log(data.list);
        console.log('여기로 오나?');
      });
    } else {
      console.log("입력 칸이 비어있습니다");
    }
  }
  
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
      {visible && 
        <div className="dark-background">
          <div className="dialog">
            <p>방 생성</p>
            <form className="input-wrap" action="submit">
              <label htmlFor="room-id">방 제목</label>
              <input type="text" id="room-id" onChange={changeDialogRoomName}/>
              <label htmlFor="room-detail">방 설명</label>
              <input type="text" id="room-detail" onChange={changeDialogRoomDescription}/>
            </form>
            <div className="button-wrap">
              <div className="button" onClick={createRoom}>생성</div>
              <div className="button" onClick={toggleCreateRoomDialog}>취소</div>
            </div>
          </div>
        </div>
      }
      <div className={'roomList'}>
        {roomList.map(val => (
          <div className={'room'} onClick={fff} key={idx}>
            {val}
          </div>
        ))}
      </div>
      <input type={'button'} value={'방 추가'} onClick={toggleCreateRoomDialog}></input>
    </>
  );
};
