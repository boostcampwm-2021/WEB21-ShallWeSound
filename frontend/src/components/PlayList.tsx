import React from 'react';
import styled from 'styled-components';
import type { Music } from '../types';
import PlayListItem from './PlayListItem';

type Props = {
  playList: Music[];
};

const PlayList = ({ playList }: Props) => {
  return (
    <Container>
      <Title>P L A Y &nbsp; L I S T</Title>
      <Wrapper>
        {playList.map((music: Music, i: number) => (
          <PlayListItem key={i} name={music.name}></PlayListItem>
        ))}
      </Wrapper>
      <AddButton>+</AddButton>
    </Container>
  );
};

const Container = styled.div`
  background: linear-gradient(to top right, blue, pink);
  border-radius: 10px;
  box-shadow: rgb(0 0 0 / 50%) 0px 10px 25px;
  width: 250px;
  height: 500px;
  margin: 48px;
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
    display: none; /* Chrome, Safari, Opera*/
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
