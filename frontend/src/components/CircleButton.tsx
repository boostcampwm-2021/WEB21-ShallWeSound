import React from 'react';
import styled from 'styled-components';

interface Props {
  children: string;
  size: string;
  color: string;
  onClick?: () => void;
}

const CircleButton = ({ children, size, color, onClick }: Props) => {
  return (
    <>
      <StyledButton size={size} color={color} onClick={onClick}>
        {children}
      </StyledButton>
    </>
  );
};

const StyledButton = styled.button<Props>`
  width: ${props => props.size};
  height: ${props => props.size};
  background-color: ${props => props.color};
  border-radius: 50%;
  border: 1px solid #ffffff;
  padding: 0;
  box-shadow: rgb(0 0 0 / 70%) 0px 10px 25px;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
    background-color: transparent;
  }
`;

export default CircleButton;
