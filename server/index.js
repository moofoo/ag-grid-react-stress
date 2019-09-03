var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var _ = require('lodash');

let testRunning = false;
let bookCount = 15;
let tradeCount = 5;
let rate = 50;
let size = 100;
let updateIntervalId = null;
let totalRows = 0;

const now = new Date();
var date = now.getDate();
var month = now.getMonth();
var year = now.getFullYear();

const startDt = new Date(year, month, date, 0, 0, 0).getTime();

const PRODUCTS = [
  'Palm Oil',
  'Rubber',
  'Wool',
  'Amber',
  'Copper',
  'Lead',
  'Zinc',
  'Tin',
  'Aluminium',
  'Aluminium Alloy',
  'Nickel',
  'Cobalt',
  'Molybdenum',
  'Recycled Steel',
  'Corn',
  'Oats',
  'Rough Rice',
  'Soybeans',
  'Rapeseed',
  'Soybean Meal',
  'Soybean Oil',
  'Wheat',
  'Milk',
  'Coca',
  'Coffee C',
  'Cotton No.2',
  'Sugar No.11',
  'Sugar No.14'
]; //28

// add / remove portfolios to change the data set
const PORTFOLIOS = [
  'Aggressive',
  'Defensive',
  'Income',
  'Speculative',
  'Hybrid'
]; //5

// these are the list of columns that updates go to
const VALUE_FIELDS = [
  'current',
  'previous',
  'pl1',
  'pl2',
  'gainDx',
  'sxPx',
  '_99Out'
];

// a list of the data, that we modify as we go. if you are using an immutable
// data store (such as Redux) then this would be similar to your store of data.
let globalRowData;

// start the book id's and trade id's at some future random number,
// looks more realistic than starting them at 0
let nextBookId = 62472;
let nextTradeId = 24287;
let nextBatchId = 101;

function createRowData(books, trades) {
  console.log('creating row data');
  globalRowData = [];
  let thisBatch = nextBatchId++;
  for (let i = 0; i < PRODUCTS.length; i++) {
    let product = PRODUCTS[i];
    for (let j = 0; j < PORTFOLIOS.length; j++) {
      let portfolio = PORTFOLIOS[j];

      for (let k = 0; k < books; k++) {
        let book = createBookName();
        for (var l = 0; l < trades; l++) {
          let trade = createTradeRecord(product, portfolio, book, thisBatch);
          globalRowData.push(trade);
        }
      }
    }
  }
  console.log('Total number of records sent to grid = ' + globalRowData.length);

  totalRows = globalRowData.length;
}

// https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getAverage(trade) {
  return Math.floor(
    (trade.pl1 + trade.pl2 + trade.gainDx + trade.sxPx + trade._99Out) / 5
  );
}

function createTradeRecord(product, portfolio, book, batch) {
  const current = Math.floor(Math.random() * 100000) + 100;
  const previous = current + Math.floor(Math.random() * 10000) - 2000;
  const trade = {
    rowId: _.uniqueId(),
    product: product,
    portfolio: portfolio,
    book: book,
    trade: createTradeId(),
    submitterID: randomBetween(10, 1000),
    submitterDealID: randomBetween(10, 1000),
    dealType: Math.random() < 0.2 ? 'Physical' : 'Financial',
    bidFlag: Math.random() < 0.5 ? 'Buy' : 'Sell',
    current: current,
    previous: previous,
    pl1: randomBetween(100, 100000),
    pl2: randomBetween(100, 100000),
    gainDx: randomBetween(100, 100000),
    sxPx: randomBetween(100, 100000),
    _99Out: randomBetween(100, 100000),
    batch: batch,
    updateDt: startDt + randomBetween(1, 86400000)
  };
  trade.average = getAverage(trade);
  return trade;
}

function createBookName() {
  nextBookId++;
  return 'GL-' + nextBookId;
}

function createTradeId() {
  nextTradeId++;
  return nextTradeId;
}

function updateSomeItems(updateCount) {
  const itemsToUpdate = [];
  for (let k = 0; k < updateCount; k++) {
    if (globalRowData.length === 0) {
      continue;
    }
    const indexToUpdate = Math.floor(Math.random() * globalRowData.length);
    const itemToUpdate = globalRowData[indexToUpdate];

    // make a copy of the item, and make some changes, so we are behaving
    // similar to how the
    const field = VALUE_FIELDS[Math.floor(Math.random() * VALUE_FIELDS.length)];
    itemToUpdate[field] = Math.floor(Math.random() * 100000);
    itemToUpdate.updateDt =
      itemToUpdate.updateDt + randomBetween(60000, 900000);

    itemToUpdate.average = getAverage(itemToUpdate);

    itemsToUpdate.push(itemToUpdate);
  }
  return itemsToUpdate;
}

function streamUpdates(socket, updateRate, updateSize, delay = 0) {
  clearInterval(updateIntervalId);

  setTimeout(function() {
    updateIntervalId = setInterval(function() {
      socket.emit('updateRowData', {
        records: updateSomeItems(updateSize)
      });
    }, updateRate);
  }, delay);
}

createRowData(bookCount, tradeCount);

io.on('connection', function(socket) {
  console.log('a user connected');

  socket.emit('setRowData', globalRowData);

  socket.on('updateTestRunning', function(val) {
    testRunning = val;

    if (testRunning) {
      streamUpdates(socket, rate, size);
    } else {
      clearInterval(updateIntervalId);
    }
  });

  socket.on('updateBookCount', function(val) {
    bookCount = val;

    createRowData(bookCount, tradeCount);

    socket.emit('setRowData', globalRowData);

    if (testRunning) {
      streamUpdates(socket, rate, size, 1000);
    }
  });

  socket.on('updateTradeCount', function(val) {
    tradeCount = val;

    createRowData(bookCount, tradeCount);

    socket.emit('setRowData', globalRowData);

    if (testRunning) {
      streamUpdates(socket, rate, size, 1000);
    }
  });

  socket.on('updateRate', function(val) {
    rate = val;

    if (testRunning) {
      streamUpdates(socket, rate, size, 1000);
    }
  });

  socket.on('updateSize', function(val) {
    size = val;

    if (testRunning) {
      streamUpdates(socket, rate, size, 1000);
    }
  });

  socket.on('setConfig', function(config) {
    testRunning = false;
    size = config.size;
    rate = config.rate;
    tradeCount = config.tradeCount;
    bookCount = config.bookCount;

    createRowData(bookCount, tradeCount);

    socket.emit('setRowData', globalRowData);
  });
});

http.listen(3030, function() {
  console.log('listening on *:3030');
});
