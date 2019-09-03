import React from 'react';
import { connect } from 'react-redux';
import ReactEcharts from 'echarts-for-react';
import { chartOptionSelector } from './option';

const EChartsChart = ({ option }) => (
  <ReactEcharts
    notMerge={false}
    option={option}
    theme='dark'
    opts={{ renderer: 'canvas' }}
  />
);

const mapStateToProps = state => {
  return {
    option: chartOptionSelector(state),
    rowData: state.data.rowData
  };
};

export default connect(mapStateToProps)(EChartsChart);
