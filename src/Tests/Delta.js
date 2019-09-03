import React from 'react';
import { connect } from 'react-redux';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import './grid.css';

import { setGridApis, setGridReady } from '../store/grid/actions';

import { updateRowDataDelta } from '../store/data/actions';

import { gridOptions, getFieldDefs } from './shared';

import socket from '../socket';

class DeltaGrid extends React.Component {
  constructor(props) {
    super(props);

    this.gridOptions = {
      ...gridOptions,
      deltaRowDataMode: true,
      onGridReady: this.onGridReady
    };
  }
  n;

  updateRowData = data => {
    this.props.onUpdateRowDataDelta(data);
  };

  componentDidMount = () => {
    socket.on('updateRowData', this.updateRowData);
  };

  componentWillUnmount = () => {
    socket.off('updateRowData', this.updateRowData);
  };

  componentDidUpdate = prevProps => {
    if (
      this.props.gridReady &&
      prevProps.idIndexMap !== this.props.idIndexMap
    ) {
      this.props.gridApi.setRowData(this.props.initData);
      return;
    }
  };

  onGridReady = ({ api, columnApi }) => {
    const { onSetGridApis, onSetGridReady } = this.props;
    if (api) {
      onSetGridReady(true);
      onSetGridApis(api, columnApi);
    }
  };

  render() {
    const { rowData } = this.props;

    return rowData.length ? (
      <div className='Grid ag-theme-balham'>
        <AgGridReact gridOptions={this.gridOptions} rowData={rowData} />
      </div>
    ) : null;
  }
}

const mapStateToProps = state => {
  return {
    idIndexMap: state.data.idIndexMap,
    rowData: state.data.rowData
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSetGridApis: (gridApi, columnApi) =>
      dispatch(setGridApis(gridApi, columnApi)),
    onSetGridReady: ready => dispatch(setGridReady(ready)),
    onUpdateRowDataDelta: data => dispatch(updateRowDataDelta(data))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeltaGrid);
