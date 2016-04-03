"use strict";

const request = require('request');
const mkdirp = require('mkdirp');
const path = require('path');
const fs = require('fs');
const async = require('async');

const filePath = path.join(__dirname, 'raw');
const currencyPair = 'btc_cny';
mkdirp(filePath, (err) => {
  if (err) {
    console.log(err);
  }
  let i = 1; // starting with 0 gives you last 80 trades
  let json = {};
  let cumulativeData = [];
  async.doWhilst((cb) => {
    request(`http://data.bter.com/api/1/trade/${currencyPair}/${i}`, (err, response, body) => {
      if (err) {
        cb(err);
      }
      
      cumulativeData = cumulativeData.concat(JSON.parse(body).data);
      i += 1000;
      console.log(`Gathering record ${i}`);
      cb(null, cumulativeData);
    });
  }, () => {
    return i < 1000000;
    return json.data.length > 0;
  }, (err, data) => {
    if (err) {
      console.log(err);
    }
    fs.writeFile(path.join(filePath, `${currencyPair}.json`), JSON.stringify(data), (err) => {
      if (err) {
        console.log(err);
      }
      console.log(`Data writen to raw/${currencyPair}.json!`);
    });
  });
});