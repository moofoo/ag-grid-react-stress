import { SET_GRID_APIS, SET_GRID_READY } from "../actionTypes";

const initialState = {
  gridApi: null,
  columnApi: null,
  gridReady: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_GRID_APIS: {
      return {
        ...state,
        gridApi: action.gridApi,
        columnApi: action.columnApi
      };
    }
    case SET_GRID_READY: {
      return {
        ...state,
        gridReady: action.ready
      };
    }
    default:
      return state;
  }
};

export default reducer;
