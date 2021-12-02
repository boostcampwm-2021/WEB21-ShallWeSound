import { useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import '../../../stylesheets/palette.scss';

function Title({ name = 'Title', singer = 'Singer' }: { name: string | undefined; singer: string | undefined }) {
  const movedItem = useRef<HTMLDivElement | null>(null);

  const isOverflow = () => {
    if (!movedItem.current) return false;
    return movedItem.current.scrollWidth > movedItem.current.clientWidth;
  };

  return (
    <Wrapper>
      <TitleWrapper>
        <TitleText length={name.length} isOverflow={isOverflow()} ref={movedItem}>
          {name}
        </TitleText>
      </TitleWrapper>
      <SingerWrapper>{singer}</SingerWrapper>
    </Wrapper>
  );
}

const moveTitle = (length: number, isOverflow: boolean) => {
  if (!isOverflow) return null;

  const point = -length * 3.8;

  return keyframes`
      from {
        transform: translateX(0%)
      }
      to {
        transform: translateX(${point}%)
      }
  `;
};

const Wrapper = styled.div`
  box-sizing: border-box;
  outline: thick double #f9f9f9;
  border-radius: 0.5rem;
  color: #f9f9f9;
  padding: 0.5rem;
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  white-space: nowrap;
`;

const TitleWrapper = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0.25rem;
`;

interface TitleTextProps {
  length: number;
  isOverflow: boolean;
}

const TitleText = styled.div<TitleTextProps>`
  animation: ${props => moveTitle(props.length, props.isOverflow)} ${props => props.length / 5}s linear infinite;
  animation-delay: 1s;
  overflow: visible;
`;

const SingerWrapper = styled.div`
  font-style: italic;
  font-size: 1.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export default Title;
