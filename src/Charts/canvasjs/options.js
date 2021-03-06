import { createSelector } from 'reselect';
import { getProductsSelection } from '../shared';

const productsSelection = getProductsSelection(10);

const options = {
  theme: 'dark2',
  animationEnabled: true,
  zoomEnabled: true,
  legend: {
    verticalAlign: 'top'
  },
  axisX: {
    title: 'Time',
    crosshair: {
      enabled: true,
      snapToDataPoint: true
    }
  },
  axisY: {
    title: 'Average',
    includeZero: false,
    crosshair: {
      enabled: true,
      snapToDataPoint: true
    }
  },
  data: []
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

          productsData[data.product].push({
            x: new Date(data.updateDt),
            y: data.average
          });

          indexCache.push(index);
        }
      });
    } else {
      indexCache.forEach(index => {
        const data = rowData[index];
        if (!productsData[data.product]) {
          productsData[data.product] = [];
        }

        productsData[data.product].push({
          x: new Date(data.updateDt),
          y: data.average
        });
      });
    }

    return productsData;
  }
);

const productDataSelector = createSelector(
  productSelector,
  productsData => {
    const data = [];

    for (let prod in productsData) {
      data.push({
        name: prod,
        dataPoints: productsData[prod],
        type: 'scatter',
        showInLegend: true
      });
    }

    return data;
  }
);

export const chartOptionsSelector = createSelector(
  productDataSelector,
  productData => {
    return {
      ...options,
      data: productData
    };
  }
);
