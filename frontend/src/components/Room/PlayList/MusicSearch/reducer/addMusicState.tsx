interface Action {
  type: string;
}

interface State {
  success: boolean;
  fail: boolean;
}

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'INIT':
      return {
        success: false,
        fail: false,
      };
    case 'SUCCESS':
      return {
        success: true,
        fail: false,
      };
    case 'FAILURE':
      return {
        success: false,
        fail: true,
      };
    default:
      return {
        success: false,
        fail: false,
      };
  }
};
