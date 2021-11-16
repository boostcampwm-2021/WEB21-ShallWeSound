import React from 'react';
import styled from 'styled-components';
import { useSocket } from '../../../context/MyContext';

type Props = {
  title: string;
  singer: string;
};

type TextProps = {
  color: string;
  weight: string;
  size: string;
};

const PlayListItem = ({ title, singer }: Props) => {
  const socket: any = useSocket();

  const clickPlay = () => {
    socket.emit('clickAndPlayMusic', title);
  };

  return (
    <Item onClick={clickPlay}>
      <Wrapper>
        <Text color="#ffffff" weight="500" size="20px">
          {title}
        </Text>
        <Text color="#FAFAFA" weight="0" size="14px">
          {singer}
        </Text>
      </Wrapper>
      <Detail></Detail>
    </Item>
  );
};

const Item = styled.div`
  height: 50px;
  margin: 0px 20px;
  line-height: 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:not(:last-child) {
    border-bottom: 1px solid #ecdff5;
  }
`;

const Wrapper = styled.div`
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
`;

const Text = styled.div<TextProps>`
  color: ${props => props.color};
  font-weight: ${props => props.weight};
  font-size: ${props => props.size};
  margin: 0px 10px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Detail = styled.div`
  position: relative;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: #ffffff;
  margin-right: 10px;

  &:before,
  &:after {
    content: '';
    position: absolute;
    width: 4px;
    height: 4px;
    background-color: inherit;
    border-radius: inherit;
  }

  &:before {
    top: -7px;
  }

  &:after {
    top: 7px;
  }
`;

export default PlayListItem;
