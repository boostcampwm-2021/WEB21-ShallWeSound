import { useEffect } from 'react';
import styled from 'styled-components';

interface Props {
  widthP: string;
  heightP: string;
  onToggle: () => void;
  children: JSX.Element;
}

interface StyledProps {
  widthP: string;
  heightP: string;
}

const Modal = ({ widthP, heightP, onToggle, children }: Props) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <>
      <BlackScreen onClick={onToggle}>
        <StyledModal widthP={widthP} heightP={heightP} onClick={e => e.stopPropagation()}>
          <Head>
            <CloseButton onClick={onToggle}>X</CloseButton>
          </Head>
          {children}
        </StyledModal>
      </BlackScreen>
    </>
  );
};

const BlackScreen = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  margin: 0px;
  background: rgba(0, 0, 0, 0.4);
  z-index: 100;
`;

const StyledModal = styled.div<StyledProps>`
  width: ${props => props.widthP};
  height: ${props => props.heightP};
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: rgb(0 0 0 / 100%) 0px 10px 25px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 200;
`;

const Head = styled.div`
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0px 15px;
`;

const CloseButton = styled.button`
  width: 20px;
  height: 20px;
  cursor: pointer;
  background-color: transparent;
  border: none;
  padding: 0;
`;

export default Modal;
