import React from 'react';
import styled from 'styled-components';
import PlayList from '../components/PlayList';

const Room = () => {
  return (
    <StyledDiv>
      <PlayList></PlayList>
    </StyledDiv>
  );
};

const StyledDiv = styled.div`
  width: 100vw;
  height: 100vh;
`;

export default Room;
