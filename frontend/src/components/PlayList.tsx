import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import type { Music } from '../types';
import PlayListItem from './PlayListItem';
import CircleButton from './CircleButton';
import Modal from './Modal';
import MusicSearch from './MusicSearch';
import { useSocket } from '../context/MyContext';


const PlayList = () => {
  const socket: any = useSocket();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [playList, setPlayList] = useState<Music[]>([]);
  const page = useRef(0);

  useEffect(() => {
    socket.on('responsePlayList', (data: Music[]) => {
      setPlayList([...playList, ...data]);
      page.current += data.length;
    });

    return () => {
      socket.off('responsePlayList');
    };
  }, [playList, socket]);

  useEffect(() => {
    socket.emit('requestPlayList', page.current);
  }, [socket]);

  const toggleModal = () => setModalVisible(!modalVisible);

  const isEndOfScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>): boolean =>
    e.currentTarget.scrollTop + e.currentTarget.clientHeight >= e.currentTarget.scrollHeight;

  const onScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>): void => {
    if (isEndOfScroll(e)) {
      socket.emit('requestPlayList', page.current);
    }
  };

  return (
    <Container>
      <Title>P L A Y &nbsp; L I S T</Title>
      <PlayListWrapper onScroll={onScroll}>
        {playList.map((music: Music, i: number) => (
          <PlayListItem key={i} title={music.title} singer={music.singer} />
        ))}
      </PlayListWrapper>
      <ButtonWrapper>
        <CircleButton size="45px" colorP="#ffffff" onClick={toggleModal}>
          +
        </CircleButton>
      </ButtonWrapper>

      {modalVisible ? (
        <Modal widthP="350px" heightP="650px" onToggle={toggleModal}>
          <MusicSearch />
        </Modal>
      ) : null}
    </Container>
  );
};

const Container = styled.div`
  background: none;
  outline: 4px solid #fff;
  border-radius: 10px;
  box-shadow: rgb(0 0 0 / 50%) 0px 10px 25px;
  width: 280px;
  height: 816px;
  float: right;
  position: relative;
`;

const Title = styled.div`
  color: #ffffff;
  font-weight: 500;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  margin: 10px 0px;
`;

const PlayListWrapper = styled.div`
  height: 80%;
  overflow: auto;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  &::-webkit-scrollbar {
    /* Chrome, Safari, Opera*/
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    height: 17%;
    background-color: rgba(255, 255, 255, 1);
    border-radius: 10px;
  }
`;

const ButtonWrapper = styled.div`
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
`;

export default PlayList;
