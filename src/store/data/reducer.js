import {
  SET_ROW_DATA,
  UPDATE_ROW_DATA_DELTA,
  UPDATE_ROW_DATA_BATCH
} from '../actionTypes';

const initialState = {
  rowData: [],
  idIndexMap: {},
  update: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ROW_DATA: {
      const map = {};

      action.rowData.forEach((row, index) => {
        const id = row.trade;
        map[id] = index;
      });

      return {
        ...state,
        rowData: action.rowData,
        idIndexMap: map,
        update: []
      };
    }
    case UPDATE_ROW_DATA_DELTA: {
      const newRowData = state.rowData.slice();

      action.rowUpdate.records.forEach(row => {
        const index = state.idIndexMap[row.trade];
        newRowData[index] = row;
      });

      return {
        ...state,
        rowData: newRowData
      };
    }
    case UPDATE_ROW_DATA_BATCH: {
      const newRowData = state.rowData.slice();

      action.rowUpdate.records.forEach(row => {
        const index = state.idIndexMap[row.trade];
        newRowData[index] = row;
      });

      return {
        ...state,
        rowData: newRowData,
        update: action.rowUpdate.records
      };
    }
    default:
      return state;
  }
};

export default reducer;
