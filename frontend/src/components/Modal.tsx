import React from 'react';
import styled from 'styled-components';

interface Props {
  width: string;
  height: string;
  children: JSX.Element;
}

interface StyledProps {
  width: string;
  height: string;
}

const Modal = ({ width, height, children }: Props) => {
  return (
    <>
      <Container>
        <StyledModal width={width} height={height}>
          {children}
        </StyledModal>
      </Container>
    </>
  );
};

const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  margin: 0px;
  background: rgba(0, 0, 0, 0.4);
  z-index: 100;
`;

const StyledModal = styled.div<StyledProps>`
  width: ${props => props.width};
  height: ${props => props.height};
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: rgb(0 0 0 / 100%) 0px 10px 25px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 200;
`;

export default Modal;
