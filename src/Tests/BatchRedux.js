import React from 'react';
import { connect } from 'react-redux';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import './grid.css';

import { setGridApis, setGridReady } from '../store/grid/actions';

import { updateRowDataBatch } from '../store/data/actions';

import { gridOptions } from './shared';

import socket from '../socket';

class BatchReduxGrid extends React.Component {
  constructor(props) {
    super(props);

    this.gridOptions = {
      ...gridOptions,
      onGridReady: this.onGridReady
    };
  }

  updateRowData = data => {
    this.props.onUpdateRowDataBatch(data);
  };

  componentDidMount = () => {
    socket.on('updateRowData', this.updateRowData);
  };

  componentWillUnmount = () => {
    socket.off('updateRowData', this.updateRowData);
  };

  componentDidUpdate = prevProps => {
    // Needed to detect changes to rowData when bookCount or tradeCount change
    if (
      this.props.gridReady &&
      prevProps.idIndexMap !== this.props.idIndexMap
    ) {
      this.props.gridApi.setRowData(this.props.initData);
      return;
    }

    // Pass incoming updates to batchUpdateRowData

    if (this.props.gridReady && prevProps.update !== this.props.update) {
      this.props.gridApi.batchUpdateRowData({
        update: this.props.update
      });
    }
  };

  onGridReady = ({ api, columnApi }) => {
    const { onSetGridApis, onSetGridReady, initData } = this.props;
    if (api) {
      api.setRowData(initData);
      onSetGridApis(api, columnApi);
      onSetGridReady(true);
    }
  };

  render() {
    const { initData } = this.props;

    return initData.length ? (
      <div className='Grid ag-theme-balham'>
        <AgGridReact gridOptions={this.gridOptions} />
      </div>
    ) : null;
  }
}

const mapStateToProps = state => {
  return {
    initData: state.data.rowData,
    idIndexMap: state.data.idIndexMap,
    update: state.data.update,
    gridReady: state.grid.gridReady,
    gridApi: state.grid.gridApi
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSetGridApis: (gridApi, columnApi) =>
      dispatch(setGridApis(gridApi, columnApi)),
    onSetGridReady: ready => dispatch(setGridReady(ready)),
    onUpdateRowDataBatch: data => dispatch(updateRowDataBatch(data))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BatchReduxGrid);
