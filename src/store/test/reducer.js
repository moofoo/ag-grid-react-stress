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

export const initialState = {
  method: 'delta',
  chartType: null,
  running: false,
  bookCount: 15,
  tradeCount: 5,
  updateRate: 100,
  updateSize: 100,
  totalRows: 10500 // 140 * bookCount * tradeCount,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CONFIG: {
      const { rate, size, bookCount, tradeCount } = action;

      return {
        ...state,
        updateRate: rate,
        updateSize: size,
        bookCount,
        tradeCount
      };
    }
    case SET_TEST_METHOD: {
      return {
        ...state,
        method: action.method
      };
    }

    case SET_CHART_TYPE: {
      return {
        ...state,
        chartType: action.chartType
      };
    }

    case SET_TEST_RUNNING: {
      return {
        ...state,
        running: action.running
      };
    }

    case SET_BOOK_COUNT: {
      return {
        ...state,
        bookCount: action.count,
        totalRows: 140 * action.count * state.tradeCount
      };
    }

    case SET_TRADE_COUNT: {
      return {
        ...state,
        tradeCount: action.count,
        totalRows: 140 * state.bookCount * action.count
      };
    }

    case SET_UPDATE_RATE: {
      return {
        ...state,
        updateRate: action.rate
      };
    }

    case SET_UPDATE_SIZE: {
      return {
        ...state,
        updateSize: action.size
      };
    }

    default:
      return state;
  }
};

export default reducer;
