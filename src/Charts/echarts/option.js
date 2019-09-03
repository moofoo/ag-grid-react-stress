import { createSelector } from 'reselect';
import { getProductsSelection } from '../shared';

const productsSelection = getProductsSelection();

const option = {
  legend: {
    data: productsSelection
  },
  xAxis: {
    type: 'time'
  },
  yAxis: {
    type: 'value'
  },
  animation: false
};

const productSeriesSelector = createSelector(
  state => state.data.rowData,
  rowData => {
    const productsData = {};

    rowData.forEach(data => {
      if (productsSelection.includes(data.product)) {
        if (!productsData[data.product]) {
          productsData[data.product] = [];
        }

        productsData[data.product].push([data.updateDt, data.average]);
      }
    });

    const series = [];

    for (let prod in productsData) {
      series.push({
        name: prod,
        data: productsData[prod],
        type: 'scatter',
        large: true
      });
    }

    return series;
  }
);

export const chartOptionSelector = createSelector(
  productSeriesSelector,
  productSeries => {
    return {
      ...option,
      series: productSeries
    };
  }
);
