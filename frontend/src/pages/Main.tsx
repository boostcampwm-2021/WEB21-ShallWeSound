import React, { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { useSocket } from '../context/MyContext';
import config from '../config.host.json';
import { useAsync } from '../context/useAsync';
import { RouteComponentProps } from 'react-router';

import '../stylesheets/main.scss';
import { fetchState } from '../types';
import HeaderComponent from '../components/Header/Header';
import CreateRoomModal from '../components/Header/CreateRoomModal';

export const MainPage = ({ history }: { history: RouteComponentProps['history'] }) => {
  const socket: Socket = useSocket()!;
  const [visible, setVisible] = useState(false);
  
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
  
  function toggleCreateRoomDialog(e: any) {
    console.log(typeof(e))
    setVisible(!visible);
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
    <>
      <HeaderComponent history={history} />
      <div className={'body'}>
        {/* <CreateRoomModal history={history} socket={socket} onCancel={() => toggleCreateRoomDialog} /> */}
        <div className="main-wrap">
          <h2>방 참가하기</h2>
          <div className={'roomList'}>
            {roomList.length ? (
              roomList.map(val => <Room id={val.id} name={val.name} description={val.description} />)
            ) : (
              <p className="room-empty-notice">열려 있는 방이 존재하지 않습니다!</p>
            )}
          </div>
          {/* <button className="button" onClick={toggleCreateRoomDialog}>
            방 추가
          </button> */}
        </div>
      </div>
    </>
  );
};
