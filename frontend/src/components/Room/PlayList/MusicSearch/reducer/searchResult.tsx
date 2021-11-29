import { Music } from '../../../../../types';

interface State {
  result: Music[];
  selectedMusicInResult: number[];
  hasMore?: boolean;
  loading?: boolean;
}

interface Action {
  type: string;
  result?: Music[];
  selectedInResult?: number[];
  hasMore?: boolean;
  loading?: boolean;
}

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'INIT':
      return {
        result: [],
        selectedMusicInResult: [],
        hasMore: false,
        loading: false,
      };
    case 'FETCH_LOADING':
      return {
        ...state,
        loading: true,
      };
    case 'FETCH_SUCCESS':
      return {
        result: action.result ?? [],
        selectedMusicInResult: [],
        hasMore: action.hasMore,
        loading: false,
      };
    case 'FETCH_MORE_SUCCESS':
      return {
        ...state,
        result: [...state.result, ...(action.result ?? [])],
        hasMore: action.hasMore,
        loading: false,
      };
    case 'FETCH_FAILURE':
      return {
        result: [],
        selectedMusicInResult: [],
        hasMore: false,
        loading: false,
      };
    case 'REQUEST_ADD_MUSIC_IN_PLAYLIST':
      return {
        ...state,
        selectedMusicInResult: [],
        loading: false,
      };
    case 'SELECT_MUSIC':
      return {
        ...state,
        selectedMusicInResult: action.selectedInResult ?? [],
      };
    case 'UNSELECT_MUSIC':
      return {
        ...state,
        selectedMusicInResult: action.selectedInResult ?? [],
      };
    default:
      return {
        result: [],
        selectedMusicInResult: [],
        hasMore: false,
        loading: false,
      };
  }
};
