import { useReducer, useEffect } from 'react';
import { fetchState, Action } from '../types';

const reducer = (state: fetchState, action: Action): fetchState => {
  switch (action.type) {
    case 'LOADING':
      return {
        loading: true,
        data: [],
        error: null,
      };
    case 'SUCCESS':
      return {
        loading: false,
        data: action.data,
        error: null,
      };
    case 'ERROR':
      return {
        loading: false,
        data: [],
        error: action.error,
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const useAsync = (callback: Function, apiQuery: string, dep = []) => {
  const initialState = { loading: false, data: [], error: null };

  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchUser: any = async () => {
    try {
      const result = await callback(apiQuery); // session 쓸때 credentials : 'include' 설정해주기

      dispatch({ type: 'SUCCESS', data: result });
    } catch (e) {
      dispatch({ type: 'ERROR', error: new Error() });
    }
  };

  useEffect(() => {
    fetchUser();
  }, dep);

  return [state, fetchUser];
};

export { useAsync };
