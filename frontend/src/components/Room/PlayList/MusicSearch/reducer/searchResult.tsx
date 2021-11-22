import { Music } from '../../../../../types';

interface State {
  result: Music[];
  selectedMusicInResult: number[];
}

interface Action {
  type: string;
  result?: Music[];
  selectedInResult?: number[];
}

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'INIT':
      return {
        result: [],
        selectedMusicInResult: [],
      };
    case 'FETCH_SUCCESS':
      return {
        result: [...state.result, ...(action.result ?? [])],
        selectedMusicInResult: [],
      };
    case 'FETCH_FAILURE':
      return {
        result: [],
        selectedMusicInResult: [],
      };
    case 'REQUEST_ADD_MUSIC_IN_PLAYLIST':
      return {
        ...state,
        selectedMusicInResult: [],
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
      };
  }
};
