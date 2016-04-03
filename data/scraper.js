"use strict";

const request = require('request');
const mkdirp = require('mkdirp');
const path = require('path');
const fs = require('fs');
const async = require('async');

const filePath = path.join(__dirname, 'json');
const currencyPair = 'doge_btc';
mkdirp(filePath, (err) => {
  if (err) {
    console.log(err);
  }
  request(`http://data.bter.com/api/1/trade/${currencyPair}/1`, (err, response, body) => {
    let lastTradeDate = JSON.parse(body).data[0].date;
    let i = 1; // starting with 0 gives you last 80 trades
    let json = {};
    let cumulativeData = [];
    async.doWhilst((cb) => {
      request(`http://data.bter.com/api/1/trade/${currencyPair}/${i}`, (err, response, body) => {
        if (err) {
          cb(err);
        }
        json = JSON.parse(body);
        const data = json.data;

        const firstDateInSet = data[0].date;
        const lastDateInSet = data[data.length - 1].date;
        // Number of days after the epoch subtracted, then add 1 to include last date
        const daysInSet =
          Math.floor(lastDateInSet / 86400) - Math.floor(firstDateInSet / 86400) + 1;

        let tradesByDay = [];

        for (let j = 0; j < daysInSet; j++) {
          const tradesDuringDay = data.filter((trade) => {
            const daysAfterFirst =
              Math.floor(trade.date / 86400) - Math.floor(firstDateInSet / 86400);
            if (daysAfterFirst === j) {
              return true;
            }
            return false;
          });
          tradesByDay.push(tradesDuringDay);
        }

        tradesByDay.forEach((day) => {
          const dateString = new Date(day[0].date * 1000).toISOString().substr(0, 10);
          if (day.length !== 0) {
            const high = day.reduce((prev, curr) => {
              if (curr.price > prev.price) {
                return curr;
              }
              return prev;
            }, 0);
            const low = day.reduce((prev, curr) => {
              if (curr.price < prev.price) {
                return curr;
              }
              return prev;
            }, 0);
            const volume = day.reduce((prev, curr) => {
              return prev + Number(curr.amount);
            }, 0);
            const close = day[day.length - 1].price;
            // toISOString() will give you YYYY-MM-DDTHH:mm:ss.sssZ
            // We only need YYYY-MM-DD
            cumulativeData.push({
              date: dateString,
              open: day[0].price,
              high: high.price,
              low: low.price,
              close: close,
              volume: volume,
              // it's a cryptocurrency, so no corporate actions to account for
              adjClose: close,
            });
          } else {
            // if there were no trades today, just use yesterday's data
            const yesterdayPrice = cumulativeData[length - 1].price;
            cumulativeData.push({
              date: dateString,
              open: yesterdayPrice,
              high: yesterdayPrice,
              low: yesterdayPrice,
              close: yesterdayPrice,
              volume: 0,
              adjClose: yesterdayPrice,
            });
          }
        });
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
        console.log(`Data writen to json/${currencyPair}.json!`);
      });
    });
  });
});
