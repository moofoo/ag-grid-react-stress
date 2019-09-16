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
