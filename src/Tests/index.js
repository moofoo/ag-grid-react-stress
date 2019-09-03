import React from 'react';
import DeltaGrid from './Delta';
import BatchReduxGrid from './BatchRedux';

const tests = props => {
  const { method } = props;
  let grid = null;

  switch (method) {
    case 'batchRedux':
      grid = <BatchReduxGrid />;
      break;
    case 'delta':
      grid = <DeltaGrid />;
      break;
    default:
      grid = null;
  }

  return grid;
};

export default tests;
