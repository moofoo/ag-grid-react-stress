import io from 'socket.io-client';
import store from './store';
import { setRowData } from './store/data/actions';

const socket = io.connect('http://localhost:3030');

socket.on('setRowData', data => {
  store.dispatch(setRowData(data));
});

export default socket;
