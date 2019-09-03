import { createSelector } from 'reselect';
import { getProductsSelection } from '../shared';

const productsSelection = getProductsSelection();

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

const productDataSelector = createSelector(
  state => state.data.rowData,
  rowData => {
    const productsData = {};

    rowData.forEach(data => {
      if (productsSelection.includes(data.product)) {
        if (!productsData[data.product]) {
          productsData[data.product] = [];
        }

        productsData[data.product].push({
          x: new Date(data.updateDt),
          y: data.average
        });
      }
    });

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
