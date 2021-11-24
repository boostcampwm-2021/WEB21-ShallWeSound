import React, { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import HeaderComponent from '../components/Header/Header';
import { useSocket } from '../context/MyContext';
import '../stylesheets/main.scss';
import config from '../config.host.json';
import { useAsync } from '../context/useAsync';
import { fetchState, Room } from '../types';
import { RouteComponentProps } from 'react-router';

export const MainPage = ({ history }: { history: RouteComponentProps['history'] }) => {
  const socket: Socket = useSocket()!;
  const [visible, setVisible] = useState(false);
  const [nextRoomIndex, setNextRoomIndex] = useState(1);
  const [dialogInput, setDialogInput] = useState<Room>({
    id: '',
    name: '',
    description: '',
    totalUser: 5,
  });

  const listFetch = async () => {
    const result = await fetch(`${config.localhost}/api/room`, {
      credentials: 'include',
    });
    const res = await result.json();
    return res.list;
  };

  function Room({ id, name, description, total }: { id: string; name: string; description: string; total: string }) {
    const joinRoom = (e: React.MouseEvent<HTMLElement>) => {
      history.push(`/room/${id}`);
    };

    return (
      <div className={'room'} onClick={joinRoom} key={id}>
        <p className="room-name">{name}</p>
        <p className="room-description">{description}</p>
        <p>{total}</p>
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
    if (
      dialogInput.name.split('').every(val => val === ' ') ||
      dialogInput.description.split('').every(val => val === ' ')
    ) {
      alert('공백만 입력할 수 없습니다. 다시 입력해주세요');
      return;
    }

    if (dialogInput.name && dialogInput.description) {
      socket.emit('createRoom', {
        id: nextRoomIndex,
        name: dialogInput.name,
        description: dialogInput.description,
      });
    } else {
      alert('입력칸을 다 채워주세요');
    }
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

    socket.on('createRoomRoute', (roomNumber: number) => {
      history.push(`/room/${roomNumber}`);
    });

    return () => {
      socket.off('joinRoomClient');
      socket.off('updateRoomList');
    };
  }, []);

  return (
    <>
      <div className={'body'}>
        {visible && (
          <div className="dark-background">
            <div className="dialog">
              <p>방 생성</p>
              <form className="input-wrap" action="submit">
                <label htmlFor="room-id">방 제목</label>
                <input type="text" id="room-id" placeholder="방 제목" onChange={changeDialogRoomName} />
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
                <button className="button" onClick={createRoom}>
                  생성
                </button>
                <button className="button" onClick={toggleCreateRoomDialog}>
                  취소
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="main-wrap">
          <h2>방 참가하기</h2>
          <div className={'roomList'}>
            {roomList.length ? (
              roomList.map(val => (
                <Room id={val.id} name={val.name} description={val.description} total={`${val.totalUser}명 접속 중`} />
              ))
            ) : (
              <p className="room-empty-notice">열려 있는 방이 존재하지 않습니다!</p>
            )}
          </div>
          <button className="button" onClick={toggleCreateRoomDialog}>
            방 추가
          </button>
        </div>
      </div>
    </>
  );
};
