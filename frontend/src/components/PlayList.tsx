import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import type { Music } from '../types';
import PlayListItem from './PlayListItem';
import { useSocket } from '../pages/Room';

const PlayList = () => {
  const socket: any = useSocket();
  const [playList, setPlayList] = useState<Music[]>([]);
  const [page, setPage] = useState(0);
  const count = 8;

  useEffect(() => {
    socket.on('response', (data: Music[]) => {
      setPlayList([...playList, ...data]);
    });

    return () => {
      socket.off('response');
    };
  }, [playList]);

  useEffect(() => {
    socket.emit('request', [page, count]);
  }, [page]);

  const onScroll = (e: any) => {
    if (e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight) {
      setPage(page => page + count);
    }
  };

  return (
    <Container>
      <Title>P L A Y &nbsp; L I S T</Title>
      <Wrapper onScroll={onScroll}>
        {playList.map((music: Music, i: number) => (
          <PlayListItem key={i} title={music.title} singer={music.singer}></PlayListItem>
        ))}
      </Wrapper>
      <AddButton>+</AddButton>
    </Container>
  );
};

const Container = styled.div`
  background: linear-gradient(#4b6cb7, #182848);//linear-gradient(to top right, blue, pink);
  /* outline: 4px solid #FFF; */
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

const Wrapper = styled.div`
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

const AddButton = styled.button`
  border-radius: 50%;
  border: 1px solid #ffffff;
  padding: 0;
  width: 45px;
  height: 45px;
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: rgb(0 0 0 / 70%) 0px 10px 25px;
  background-color: #ffffff;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
    background-color: transparent;
  }
`;

export default PlayList;
