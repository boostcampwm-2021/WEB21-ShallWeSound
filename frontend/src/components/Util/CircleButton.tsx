import React from 'react';
import styled from 'styled-components';

interface Props {
  children: string;
  size: string;
  colorP: string;
  onClick?: () => void;
}

const CircleButton = ({ children, size, colorP, onClick }: Props) => {
  return (
    <>
      <StyledButton size={size} colorP={colorP} onClick={onClick}>
        {children}
      </StyledButton>
    </>
  );
};

const StyledButton = styled.button<Props>`
  width: ${props => props.size};
  height: ${props => props.size};
  background: ${props => props.colorP};
  border-radius: 50%;
  border: none;
  padding: 0;
  box-shadow: rgb(0 0 0 / 30%) 0px 10px 25px;
  cursor: pointer;

  &:hover {
    transform: scale(0.95);
  }
`;

export default CircleButton;
