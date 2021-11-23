import React, { useState } from 'react';
import styled from 'styled-components';
import { resolveTypeReferenceDirective } from 'typescript';

interface playState {
  src: string;
  isPlayed: boolean;
}

const PlayButton = ({ audRef, src, play }: { audRef: any; src: string; play: Function }) => {
  const [buttonImg, setButtonImg] = useState<playState>({ src: '/icons/play.svg', isPlayed: false });

  const click = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!buttonImg.isPlayed) {
      setButtonImg({ src: '/icons/pause.svg', isPlayed: true });
      play(src);
      setTimeout(() => {
        audRef.current.play();
        audRef.current.volume = 0.1;
      }, 200);
    } else {
      setButtonImg({ src: '/icons/play.svg', isPlayed: false });
      audRef.current.pause();
    }
  };

  return (
    <>
      <StyledButton src={buttonImg.src} onClick={click}></StyledButton>
    </>
  );
};

const StyledButton = styled.img`
  width: 40px;
  height: 40px;
  background: #beaee2;
  border-radius: 50%;
  border: none;
  padding: 0;
  box-shadow: rgb(0 0 0 / 30%) 0px 10px 25px;
  cursor: pointer;
  position: absolute;
  left: 77%;
  &:hover {
    transform: scale(0.95);
  }
`;

export default PlayButton;
