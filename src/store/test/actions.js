import {
  SET_TEST_METHOD,
  SET_CHART_TYPE,
  SET_TEST_RUNNING,
  SET_BOOK_COUNT,
  SET_TRADE_COUNT,
  SET_UPDATE_RATE,
  SET_UPDATE_SIZE,
  SET_CONFIG
} from '../actionTypes';

import socket from '../../socket';

// Actions

export const setTestMethod = method => {
  return {
    type: SET_TEST_METHOD,
    method
  };
};

export const setChartType = chartType => {
  return {
    type: SET_CHART_TYPE,
    chartType
  };
};

export const setTestRunning = running => {
  return {
    type: SET_TEST_RUNNING,
    running
  };
};

export const setBookCount = count => {
  return {
    type: SET_BOOK_COUNT,
    count
  };
};

export const setTradeCount = count => {
  return {
    type: SET_TRADE_COUNT,
    count
  };
};

export const setUpdateSize = size => {
  return {
    type: SET_UPDATE_SIZE,
    size
  };
};

export const setUpdateRate = rate => {
  return {
    type: SET_UPDATE_RATE,
    rate
  };
};

export const setConfig = ({ rate, size, bookCount, tradeCount }) => {
  return {
    type: SET_CONFIG,
    rate,
    size,
    bookCount,
    tradeCount
  };
};

// Thunks

export const updateTestRunning = running => dispatch => {
  socket.emit('updateTestRunning', running);
  return dispatch(setTestRunning(running));
};

export const updateBookCount = count => dispatch => {
  socket.emit('updateBookCount', count);
  return dispatch(setBookCount(count));
};

export const updateTradeCount = count => dispatch => {
  socket.emit('updateTradeCount', count);
  return dispatch(setTradeCount(count));
};

export const updateSize = size => dispatch => {
  socket.emit('updateSize', size);
  return dispatch(setUpdateSize(size));
};

export const updateRate = rate => dispatch => {
  socket.emit('updateRate', rate);
  return dispatch(setUpdateRate(rate));
};

export const updateConfig = ({
  rate,
  size,
  bookCount,
  tradeCount
}) => dispatch => {
  socket.emit('setConfig', {
    rate,
    size,
    tradeCount,
    bookCount
  });
  return dispatch(
    setConfig({
      rate,
      size,
      tradeCount,
      bookCount
    })
  );
};
