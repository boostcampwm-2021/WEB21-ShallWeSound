import React from 'react';
import styled from 'styled-components';
import type { Music } from '../types';

type Props = {
  playList: Music[];
};

const PlayList = ({ playList }: Props) => {
  console.log(playList);
  playList.map(music => console.log(music.name));
  return (
    <StyledDiv>
      {playList.map((music: Music, i: number) => (
        <div key={i}>{music.name}</div>
      ))}
    </StyledDiv>
  );
};

const StyledDiv = styled.div`
  background-color: #d3d3d3;
  border: 1px solid #000000;
  box-shadow: rgb(0 0 0 / 20%) 0px 10px 25px;
  width: 300px;
  height: 800px;
  /* margin: 48px; */
  /* float: right; */
`;

export default PlayList;
