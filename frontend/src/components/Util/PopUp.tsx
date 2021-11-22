import React from 'react';
import styled, { keyframes } from 'styled-components';

interface Props {
  text: string;
}

const PopUp = ({ text }: Props) => {
  return (
    <>
      <Container>{text}</Container>
    </>
  );
};

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const Container = styled.div`
  z-index: 1000;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  border-radius: 10px;
  padding: 1rem;
  box-shadow: rgb(0 0 0 / 20%) 0px 10px 25px;
  /* animation: ${fadeOut} 1s ease-out; */
`;

export default PopUp;
