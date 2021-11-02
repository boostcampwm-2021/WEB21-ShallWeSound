import React, { useEffect, useReducer } from 'react';
import io from 'socket.io-client';
import styled from 'styled-components';
import PlayList from '../components/PlayList';
import type { Music } from '../types';

type State = {
  loading: boolean;
  playList: Music[] | null;
  error: unknown | null;
};
type Action =
  | { type: 'LOADING' }
  | { type: 'SUCCESS'; data: Music[] }
  | { type: 'ERROR'; error: unknown };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOADING':
      return {
        loading: true,
        playList: null,
        error: null,
      };
    case 'SUCCESS':
      return {
        loading: false,
        playList: action.data,
        error: null,
      };
    case 'ERROR':
      return {
        loading: false,
        playList: null,
        error: action.error,
      };
    default:
      throw new Error('not valid action type');
  }
};

const initState: State = {
  loading: true,
  playList: null,
  error: null,
};

const Room = () => {
  const [state, dispatch] = useReducer(reducer, initState);

  const connectSocket = () => {
    dispatch({ type: 'LOADING' });
    try {
      const socket = io('http://localhost:3000/music');

      socket.on('init', data => {
        dispatch({ type: 'SUCCESS', data });
      });
    } catch (error) {
      dispatch({ type: 'ERROR', error });
    }
  };

  useEffect(() => {
    connectSocket();
  }, []);

  const { loading, playList, error } = state;

  if (loading) return <div>loading</div>;
  if (error) return <div>error</div>;
  if (!playList) return null;

  return (
    <StyledDiv>
      <PlayList playList={playList}></PlayList>
    </StyledDiv>
  );
};

const StyledDiv = styled.div`
  width: 100vw;
  height: 100vh;
`;

export default Room;
