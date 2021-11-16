import React, { useState } from 'react';
import styled from 'styled-components';

interface Props {
  name: string;
  singer: string;
  description: string;
  thumbnail: string;
  selected: boolean;
}

const MusicSearchItem = ({ name, singer, thumbnail, description, selected }: Props) => {
  const [detail, setDetail] = useState(false);
  const onDetail = () => {
    setDetail(true);
  };
  const onDetailOut = () => {
    setDetail(false);
  };

  return (
    <SearchResultItem selected={selected}>
      <Image>
        <div>IMG</div>
      </Image>
      <TextWrapper>
        <Title>{name}</Title>
        <Singer>{singer}</Singer>
      </TextWrapper>
      <DescriptionIcon onMouseEnter={onDetail} onMouseLeave={onDetailOut}>
        {detail ? (
          <Description>
            <p>{description}</p>
          </Description>
        ) : null}
      </DescriptionIcon>
    </SearchResultItem>
  );
};

interface SearchResultItemProps {
  selected: boolean;
}

const SearchResultItem = styled.div<SearchResultItemProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem;
  width: 15rem;
  height: 3rem;
  border-bottom: 1px solid #f2f3f4;
  border-radius: 0.3rem;
  cursor: pointer;

  background-color: ${prop => (prop.selected ? '#e5e7e9' : '#ffffff')};

  &:hover {
    background-color: #f2f3f4;
  }

  &:active {
    background-color: #e5e7e9;
  }
`;

const Image = styled.div`
  width: 3rem;
  display: flex;
  align-items: center;
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  white-space: nowrap;
  overflow: hidden;
  width: calc(100% * 0.8);
  padding: 0 0.2rem;
`;

const Title = styled.div`
  font-size: 16px;
  padding: 0.2rem 0;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Singer = styled.div`
  font-size: 14px;
  color: #969696;
`;

const DescriptionIcon = styled.div`
  position: relative;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background-color: #d3d3d3;

  &:before,
  &:after {
    content: '';
    position: absolute;
    width: 3px;
    height: 3px;
    background-color: inherit;
    border-radius: inherit;
  }

  &:before {
    top: -5px;
  }

  &:after {
    top: 5px;
  }
`;

const Description = styled.div`
  position: fixed;
  width: 8rem;
  font-size: 0.8rem;
  border: 1px solid #cacfd2;
  background-color: #f7f9f9;
  box-shadow: rgb(0 0 0 / 20%) 0px 10px 25px;
  color: #969696;
  border-radius: 0.5rem;
  padding: 0.8rem;
  text-align: justify;
`;

export default MusicSearchItem;
