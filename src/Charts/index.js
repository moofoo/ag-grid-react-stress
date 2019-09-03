import React from 'react';
import EChartsChart from './echarts';
import CanvasJSChart from './canvasjs';

const charts = props => {
  const { chartType } = props;
  let chart = null;

  switch (chartType) {
    case 'echarts':
      chart = <EChartsChart />;
      break;
    case 'canvasjs':
      chart = <CanvasJSChart />;
      break;

    default:
      chart = null;
  }

  return chart;
};

export default charts;
