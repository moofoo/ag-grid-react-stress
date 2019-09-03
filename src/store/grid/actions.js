import { SET_GRID_APIS, SET_GRID_READY } from "../actionTypes";

export const setGridApis = (gridApi, columnApi) => {
  return {
    type: SET_GRID_APIS,
    gridApi,
    columnApi
  };
};

export const setGridReady = ready => {
  return {
    type: SET_GRID_READY,
    ready
  };
};
