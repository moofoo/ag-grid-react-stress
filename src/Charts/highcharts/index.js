import React from 'react';
import { connect } from 'react-redux';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { chartOptionsSelector } from './options';

const HighChartsChart = ({ options }) => (
  <div>
    <HighchartsReact highcharts={Highcharts} options={options} />
  </div>
);

const mapStateToProps = state => {
  return {
    options: chartOptionsSelector(state)
  };
};

export default connect(mapStateToProps)(HighChartsChart);
