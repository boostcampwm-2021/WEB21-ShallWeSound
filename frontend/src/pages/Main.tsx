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
    {
      name: '더미',
      description: '더미',
      id: 0,
    },
  ]);
  const [visible, setVisible] = useState(false);
  const [appear, setAppear] = useState(false);
  const [nextRoomIndex, setNextRoomIndex] = useState(3);
  const [dialogInput, setDialogInput] = useState({
    id: nextRoomIndex,
    name: '',
    description: '',
  });

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

  function changeDialogRoomName(e: React.BaseSyntheticEvent) {
    setDialogInput({
      ...dialogInput,
      name: e.target.value,
    });
  }

  function changeDialogRoomDescription(e: React.BaseSyntheticEvent) {
    setDialogInput({
      ...dialogInput,
      description: e.target.value,
    });
  }

  function toggleCreateRoomDialog() {
    setVisible(!visible);
  }

  function createRoom() {
    if (dialogInput.name && dialogInput.description) {
      socket.emit('createRoom', { name: dialogInput.name, description: dialogInput.description });
      history.push('/room');
    } else {
      console.log('입력 칸이 비어있습니다');
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
      {visible && (
        <div className="dark-background">
          <div className="dialog">
            <p>방 생성</p>
            <form className="input-wrap" action="submit">
              <label htmlFor="room-id">방 제목</label>
              <input type="text" id="room-id" onChange={changeDialogRoomName} />
              <label htmlFor="room-detail">방 설명</label>
              <input type="text" id="room-detail" onChange={changeDialogRoomDescription} />
            </form>
            <div className="button-wrap">
              <div className="button" onClick={createRoom}>
                생성
              </div>
              <div className="button" onClick={toggleCreateRoomDialog}>
                취소
              </div>
            </div>
          </div>
        </div>
      )}
      <div className={'roomList'}>
        {roomList.map(val => (
          <div className={'room'} onClick={fff} key={val.id}>
            <p>{val.name}</p>
            <p>{val.description}</p>
          </div>
        ))}
      </div>
      <input type={'button'} value={'방 추가'} onClick={toggleCreateRoomDialog}></input>
    </>
  );
};
