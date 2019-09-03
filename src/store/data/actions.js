import {
  SET_ROW_DATA,
  UPDATE_ROW_DATA_DELTA,
  UPDATE_ROW_DATA_BATCH
} from "../actionTypes";

export const setRowData = rowData => {
  return {
    type: SET_ROW_DATA,
    rowData
  };
};

export const updateRowDataDelta = rowUpdate => {
  return {
    type: UPDATE_ROW_DATA_DELTA,
    rowUpdate
  };
};

export const updateRowDataBatch = rowUpdate => {
  return {
    type: UPDATE_ROW_DATA_BATCH,
    rowUpdate
  };
};
