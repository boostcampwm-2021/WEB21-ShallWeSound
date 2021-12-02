import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import type { Music } from '../../../types';
import PlayListItem from './PlayListItem';
import CircleButton from '../../Util/CircleButton';
import Modal from '../../Util/Modal';
import MusicSearch from './MusicSearch/MusicSearch';
import { useSocket } from '../../../context/MyContext';
import ScrollBar from '../../Util/scrollbar';

const PlayList = ({ isHost }: { isHost: boolean }) => {
  const socket: any = useSocket();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [playList, setPlayList] = useState<Music[]>([]);

  useEffect(() => {
    socket.on('responsePlayList', (data: Music[]) => {
      setPlayList([...data]);
    });

    return () => {
      socket.off('responsePlayList');
    };
  }, [socket]);

  const toggleModal = () => setModalVisible(!modalVisible);

  return (
    <Container>
      <Title>P L A Y &nbsp; L I S T</Title>
      {/* <PlayListWrapper> */}
      <ScrollBar>
        {playList.length !== 0 ? (
          playList.map((music: Music, i: number) => (
            <PlayListItem
              key={i}
              MID={music.MID}
              title={music.name}
              singer={music.singer}
              isPlayed={music.isPlayed}
              isHost={isHost}
            />
          ))
        ) : (
          <Title>방장이 아직 곡을 추가하지 않았습니다. 잠시만 기다려주세요! </Title>
        )}
      </ScrollBar>
      {/* </PlayListWrapper> */}
      <ButtonWrapper>
        {isHost && (
          <CircleButton size="45px" colorP="#ffffff" onClick={toggleModal}>
            +
          </CircleButton>
        )}
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
  background: #beaee2;
  border-radius: 10px;
  /* box-shadow: rgb(0 0 0 / 50%) 0px 10px 25px; */
  width: 400px;
  height: 300px;
  float: right;
  position: relative;
  margin-right: 2rem;

  @media screen and (min-height: 768px) {
    height: calc(100% - 220px - 1rem);
  }

  @media screen and (min-height: 968px) {
    height: 300px;
  }
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

// const PlayListWrapper = styled.div`
//   height: 80%;
//   overflow: auto;
//   -ms-overflow-style: none;
//   scrollbar-width: none;

//   &::-webkit-scrollbar {
//     width: 6px;
//   }
//   &::-webkit-scrollbar-thumb {
//     height: 17%;
//     background-color: rgba(255, 255, 255, 1);
//     border-radius: 10px;
//   }
// `;

const ButtonWrapper = styled.div`
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
`;

export default PlayList;
