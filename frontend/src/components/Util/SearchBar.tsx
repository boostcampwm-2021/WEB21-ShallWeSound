import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import searchIcon from '../../images/search.png';

interface Props {
  doFetch: (keyword: string) => void;
}

const SearchBar = ({ doFetch }: Props) => {
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    doFetch(keyword);
  }, [doFetch, keyword]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  return (
    <Container>
      <img src={searchIcon} alt="검색"></img>
      <label htmlFor="keyword"></label>
      <StyledInput
        type="text"
        id="keyword"
        value={keyword}
        onChange={onChange}
        placeholder="가수, 제목"
        autoComplete="off"
      />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  border: 2px solid #000000;
  padding: 0.1rem 0.4rem;

  &:focus-within {
    border: 2px solid;
    border-image: linear-gradient(94.75deg, #918fe7 6.7%, #699eef 85.54%);
    border-image-slice: 1;
  }
`;

const StyledInput = styled.input`
  width: 13rem;
  border: none;
  padding: 0.5rem;
  font-size: 0.9rem;
  &:focus {
    outline: none;
  }
`;

export default SearchBar;