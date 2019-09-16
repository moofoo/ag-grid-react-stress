import Highcharts from 'highcharts';
import { createSelector } from 'reselect';
import { getProductsSelection } from '../shared';

const productsSelection = getProductsSelection();

const options = {
  chart: {
    type: 'scatter'
  },
  boost: {
    seriesThreshold: 2,
    enabled: true
  },
  xAxis: {
    title: {
      enabled: true,
      text: 'Time'
    },
    startOnTick: true,
    endOnTick: true,
    showLastLabel: true
  },
  yAxis: {
    min: 0,
    max: 100000,
    title: {
      text: 'Average'
    }
  },
  legend: {
    layout: 'vertical',
    align: 'left',
    verticalAlign: 'top',
    x: 100,
    y: 70,
    floating: true,
    backgroundColor: Highcharts.defaultOptions.chart.backgroundColor,
    borderWidth: 1
  },
  series: []
};

let indexCache = null;
let lastLength = 0;

const productSelector = createSelector(
  state => state.data.rowData,
  rowData => {
    const productsData = {};

    if (!indexCache || lastLength !== rowData.length) {
      lastLength = rowData.length;
      indexCache = [];
      rowData.forEach((data, index) => {
        if (productsSelection.includes(data.product)) {
          if (!productsData[data.product]) {
            productsData[data.product] = [];
          }

          productsData[data.product].push([data.updateDt, data.average]);

          indexCache.push(index);
        }
      });
    } else {
      indexCache.forEach(index => {
        const data = rowData[index];

        if (!productsData[data.product]) {
          productsData[data.product] = [];
        }

        productsData[data.product].push([data.updateDt, data.average]);
      });
    }

    return productsData;
  }
);

const productSeriesSelector = createSelector(
  productSelector,
  productsData => {
    const series = [];

    for (let prod in productsData) {
      series.push({
        name: prod,
        data: productsData[prod]
      });
    }

    return series;
  }
);

export const chartOptionsSelector = createSelector(
  productSeriesSelector,
  productSeries => {
    return {
      ...options,
      series: productSeries
    };
  }
);
