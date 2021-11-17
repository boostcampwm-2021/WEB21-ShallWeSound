import React, { useState } from 'react';
import styled from 'styled-components';
import { useSocket } from '../../../context/MyContext';

type Props = {
  MID: number;
  title: string;
  singer: string;
  isPlayed: boolean;
};

type TextProps = {
  color: string;
  weight: string;
  size: string;
};

const PlayListItem = ({ MID, title, singer, isPlayed }: Props) => {
  const socket: any = useSocket();
  const [isHover, setIsHover] = useState(false);

  const hoverHandler = () => setIsHover(!isHover);

  const clickPlay = () => {
    socket.emit('clickAndPlayMusic', title);
  };

  const onRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    socket.emit('removeMusicInPlayListReq', MID);
  };

  return (
    <Item onMouseEnter={hoverHandler} onMouseLeave={hoverHandler} onClick={clickPlay}>
      <Layout>
        <TextWrapper isPlayed={isPlayed}>
          <Text color="#ffffff" weight="500" size="18px">
            {title}
          </Text>
          <Text color="#FAFAFA" weight="0" size="14px">
            {singer}
          </Text>
        </TextWrapper>
        {isHover ? <CancelButton onClick={onRemove}>X</CancelButton> : <Detail></Detail>}
      </Layout>
    </Item>
  );
};

const Item = styled.div`
  height: 50px;
  margin: 0px 20px;
  padding: 6px 0px;
  line-height: 25px;

  &:not(:last-child) {
    border-bottom: 1px solid #ecdff5;
  }
`;

const Layout = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    cursor: pointer;
    opacity: 0.5;
  }
`;

const TextWrapper = styled.div<{ isPlayed: boolean }>`
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  background: ${props => (props.isPlayed ? '#000000' : 'transparent')};
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

const CancelButton = styled.button`
  background: transparent;
  border: none;
  color: #ffffff;
  cursor: pointer;
`;

export default PlayListItem;
