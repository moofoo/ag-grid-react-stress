import React from 'react';
import { connect } from 'react-redux';
import { chartOptionsSelector } from './options';
import CanvasJSChart from './canvasjs.react';

const CanvasChart = ({ options }) => <CanvasJSChart options={options} />;

const mapStateToProps = state => {
  return {
    options: chartOptionsSelector(state)
  };
};

export default connect(mapStateToProps)(CanvasChart);
