import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

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
      <label htmlFor="keyword"></label>
      <StyledInput
        type="text"
        id="keyword"
        value={keyword}
        onChange={onChange}
        placeholder="가수, 제목"
      />
    </Container>
  );
};

const Container = styled.div``;

const StyledInput = styled.input`
  width: 15rem;
  border-radius: 0.5rem;
  border: 2px solid #000000;
  padding: 0.5rem;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: blueviolet;
  }
`;

export default SearchBar;
