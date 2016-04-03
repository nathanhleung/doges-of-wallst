const json2csv = require('json2csv');
const path = require('path');
const fs = require('fs');

const currencyPair = 'btc_cny';
const filePath = path.join(__dirname, 'processed', `${currencyPair}.json`);
fs.readFile(filePath, (err, data) => {
  if (err) {
    console.log(err);
  }
  json2csv({
    data: JSON.parse(data),
    fieldNames: ['Date', 'Open', 'High', 'Low', 'Close', 'Volume', 'Adj Close'],
  }, (err, csv) => {
    if (err) {
      console.log(err);
    }
    fs.writeFile(path.join(__dirname, 'json2csv', `${currencyPair}.csv`), csv, (err) => {
      if (err) {
        console.log(err);
      }
      console.log(`File successfully written to ${currencyPair}.csv!`);
    })
  });
});
