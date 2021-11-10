import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import type { Music } from '../types';
import PlayListItem from './PlayListItem';
import { useSocket } from '../pages/Room';

const PlayList = () => {
  const socket: any = useSocket();
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
  background: none; //linear-gradient(#4b6cb7, #182848);//linear-gradient(to top right, blue, pink);
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
