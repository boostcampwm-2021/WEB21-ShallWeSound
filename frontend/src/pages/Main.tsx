import { listenerCount } from 'process';
import React, { useState, useContext, useEffect, useRef, EventHandler } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { Socket } from 'socket.io-client';
import { useSocket } from '../context/MyContext';
import '../stylesheets/main.scss';

interface Room {
  id: number;
  name: string;
  description: string;
}

export const MainPage = ({ history }: { history: any }) => {
  const socket: Socket = useSocket()!;

  const [roomList, setRoomList] = useState<Room[]>([]);
  const [visible, setVisible] = useState(false);
  const [appear, setAppear] = useState(false);
  const [nextRoomIndex, setNextRoomIndex] = useState(3);
  const [dialogInput, setDialogInput] = useState<Room>({
    id: nextRoomIndex,
    name: '',
    description: '',
  });

  useEffect(() => {
    socket.on('joinRoomClient', data => {
      console.log(data);
    });

    socket.on('updateRoomList', data => {
      setRoomList(data.list);
    });

    return () => {
      socket.off('joinRoomClient');
      socket.off('updateRoomList');
    };
  });

  function Room({ id, name, description }: { id: number; name: string; description: string }) {
    const joinRoom = (e: React.MouseEvent<HTMLElement>) => {
      socket.emit('joinRoom', name);
      console.log('joinRoom 이벤트 발생');
      history.push('/room');
    };

    return (
      <div className={'room'} onClick={joinRoom} key={id}>
        <p className="room-name">{name}</p>
        <p className="room-description">{description}</p>
      </div>
    );
  }

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
      socket.emit('createRoom', {
        id: nextRoomIndex,
        name: dialogInput.name,
        description: dialogInput.description,
      });
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
        setRoomList(data.list);
      });
  }, []);

  return (
    <div className={'body'}>
      {visible && (
        <div className="dark-background">
          <div className="dialog">
            <p>방 생성</p>
            <form className="input-wrap" action="submit">
              <label htmlFor="room-id">방 제목</label>
              <input
                type="text"
                id="room-id"
                placeholder="방 제목"
                onChange={changeDialogRoomName}
              />
              <label htmlFor="room-detail">방 설명</label>
              <textarea
                name="text1"
                cols={40}
                rows={5}
                className="input-description"
                id="room-detail"
                placeholder="방 설명"
                onChange={changeDialogRoomDescription}
              />
            </form>
            <div className="button-wrap">
              <button className="button" onClick={createRoom}>생성</button>
              <button className="button" onClick={toggleCreateRoomDialog}>취소</button>
            </div>
          </div>
        </div>
      )}
      <div className="main-wrap">
        <div className={'roomList'}>
          {roomList.length
            ? roomList.map(val => <Room id={val.id} name={val.name} description={val.description} />)
            : <p className="room-empty-notice">열려 있는 방이 존재하지 않습니다!</p>}
        </div>
        <button className="button" onClick={toggleCreateRoomDialog}>방 추가</button>
      </div>
    </div>
  );
};
