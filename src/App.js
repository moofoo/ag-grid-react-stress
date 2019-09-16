import React from 'react';
import { connect } from 'react-redux';

import './App.css';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

import Tests from './Tests';

import Charts from './Charts';

import {
  setTestMethod,
  setChartType,
  updateTestRunning,
  updateBookCount,
  updateTradeCount,
  updateRate,
  updateSize,
  updateConfig
} from './store/test/actions';

import { initialState } from './store/test/reducer';

const TEST_METHODS = ['batchRedux', 'delta'];
const CHART_TYPES = ['', 'echarts', 'canvasjs', 'highcharts'];
const BOOK_COUNTS = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
const TRADE_COUNTS = BOOK_COUNTS;

const UPDATE_RATES = [
  1,
  5,
  25,
  50,
  100,
  200,
  300,
  500,
  750,
  1000,
  2000,
  3000,
  4000,
  5000
];
const UPDATE_SIZES = UPDATE_RATES;

class App extends React.Component {
  onSetTestMethod = event => {
    const { setTestMethod } = this.props;
    setTestMethod(event.target.value);
  };

  onSetChartType = event => {
    const { setChartType } = this.props;
    setChartType(event.target.value);
  };

  onSetTestRunning = () => {
    const { testRunning, setTestRunning } = this.props;
    setTestRunning(!testRunning);
  };

  onSetBookCount = event => {
    const { setBookCount } = this.props;
    setBookCount(event.target.value);
  };

  onSetTradeCount = event => {
    const { setTradeCount } = this.props;
    setTradeCount(event.target.value);
  };

  onSetUpdateRate = event => {
    const { setUpdateRate } = this.props;
    setUpdateRate(event.target.value);
  };

  onSetUpdateSize = event => {
    const { setUpdateSize } = this.props;
    setUpdateSize(event.target.value);
  };

  componentDidMount = () => {
    const { setConfig } = this.props;

    const config = {
      size: initialState.updateSize,
      rate: initialState.updateRate,
      bookCount: initialState.bookCount,
      tradeCount: initialState.tradeCount
    };

    setConfig(config);

    // row ids don't match up when batchRedux AG-Grid is loaded on init for some ungodly reason
    // this forces a reload so batchRedux can be the starting method
    setTimeout(() => {
      this.props.setTestMethod('batchRedux');
    }, 1000);
  };

  render() {
    const {
      testMethod,
      chartType,
      testRunning,
      bookCount,
      tradeCount,
      updateRate,
      updateSize,
      totalRows
    } = this.props;
    return (
      <div className='App'>
        <div>
          <span>Method: </span>
          <select
            id='testMethod'
            className='TestControl'
            value={testMethod}
            onChange={this.onSetTestMethod}
          >
            {TEST_METHODS.map(method => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>

          <span>Chart: </span>
          <select
            id='testMethod'
            className='TestControl'
            value={chartType}
            onChange={this.onSetChartType}
          >
            {CHART_TYPES.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <span>Book Count: </span>
          <select
            className='TestControl'
            value={bookCount}
            onChange={this.onSetBookCount}
          >
            {BOOK_COUNTS.map(bc => (
              <option key={bc} value={bc}>
                {bc}
              </option>
            ))}
          </select>

          <span>Trade Count: </span>
          <select
            className='TestControl'
            value={tradeCount}
            onChange={this.onSetTradeCount}
          >
            {TRADE_COUNTS.map(tc => (
              <option key={tc} value={tc}>
                {tc}
              </option>
            ))}
          </select>

          <span>Update Rate(ms): </span>
          <select
            className='TestControl'
            value={updateRate}
            onChange={this.onSetUpdateRate}
          >
            {UPDATE_RATES.map(rate => (
              <option key={rate} value={rate}>
                {rate}
              </option>
            ))}
          </select>

          <span>Actions per Update: </span>
          <select
            className='TestControl'
            value={updateSize}
            onChange={this.onSetUpdateSize}
          >
            {UPDATE_SIZES.map(size => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>

          <button type='button' onClick={this.onSetTestRunning}>
            {!testRunning ? 'Run' : 'Pause'}
          </button>
        </div>
        <div>
          <span>Total Rows: {totalRows}</span>
        </div>
        <hr />

        <Tests method={testMethod} />
        <Charts chartType={chartType} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    testMethod: state.test.method,
    chartType: state.test.chartType,
    testRunning: state.test.running,
    bookCount: state.test.bookCount,
    tradeCount: state.test.tradeCount,
    updateRate: state.test.updateRate,
    updateSize: state.test.updateSize,
    totalRows: state.test.totalRows
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setTestMethod: method => dispatch(setTestMethod(method)),
    setChartType: chartType => dispatch(setChartType(chartType)),
    setBookCount: count => dispatch(updateBookCount(count)),
    setTradeCount: count => dispatch(updateTradeCount(count)),
    setUpdateRate: rate => dispatch(updateRate(rate)),
    setUpdateSize: size => dispatch(updateSize(size)),
    setTestRunning: running => dispatch(updateTestRunning(running)),
    setConfig: ({ rate, size, bookCount, tradeCount }) =>
      dispatch(updateConfig({ rate, size, bookCount, tradeCount }))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
