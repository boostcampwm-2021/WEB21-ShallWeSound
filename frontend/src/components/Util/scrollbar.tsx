import styled from 'styled-components';

interface Props {
  color_?: string;
}

const ScrollBar = styled.div<Props>`
  height: 80%;
  overflow: auto;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  &::-webkit-scrollbar {
    /* Chrome, Safari, Opera*/
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    height: 17%;
    background-color: ${props => props.color_ ?? 'rgba(255, 255, 255, 1)'};
    border-radius: 10px;
  }
`;

export default ScrollBar;
