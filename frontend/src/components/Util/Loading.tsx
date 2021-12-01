import React from 'react';
import styled, { keyframes } from 'styled-components';

const Loading = () => {
  return <Circle></Circle>;
};

const spin = keyframes`
  from {
        transform:translate(-50%, -50%) rotate(0);
  }
  to {
        transform:translate(-50%, -50%) rotate(360deg);
  }
`;

const Circle = styled.div`
  border-radius: 100%;
  border: 5px solid#ffffff;
  border-top-color: #d3d3d3;
  width: 15px;
  height: 15px;
  animation: ${spin} 1s infinite;
`;

export default Loading;
