"use strict";

const request = require('request');
const mkdirp = require('mkdirp');
const path = require('path');
const fs = require('fs');
const async = require('async');

const filePath = path.join(__dirname, 'processed');
const currencyPair = 'doge_btc';
mkdirp(filePath, (err) => {
  if (err) {
    console.log(err);
  }
  fs.readFile(
    path.join(__dirname, 'raw', `${currencyPair}.json`),
    (err, data) => {
      let json = JSON.parse(data);
      let cumulativeData = [];

      const firstDateInSet = json[0].date;
      const lastDateInSet = json[json.length - 1].date;
      // Number of days after the epoch subtracted, then add 1 to include last date
      const daysInSet =
        Math.floor(lastDateInSet / 86400) - Math.floor(firstDateInSet / 86400) + 1;

      let tradesByDay = [];
      for (let i = 0; i < daysInSet; i++) {
        tradesByDay.push([]);
      }

      json.forEach((trade) => {
        const daysAfterFirst =
            Math.floor(trade.date / 86400) - Math.floor(firstDateInSet / 86400);
        tradesByDay[daysAfterFirst].push(trade);
      });

      tradesByDay.forEach((day) => {
        const dateString = new Date(day[0].date * 1000).toISOString().substr(0, 10);
        if (day.length !== 0) {
          const high = day.reduce((prev, curr) => {
            const currPrice = Number(curr.price);
            if (currPrice > prev) {
              return currPrice;
            }
            return prev;
          }, 0);
          const low = day.reduce((prev, curr) => {
            const currPrice = Number(curr.price);
            if (currPrice < prev) {
              return currPrice;
            }
            return prev;
          }, Infinity);
          const volume = day.reduce((prev, curr) => {
            return prev + Number(curr.amount);
          }, 0);
          const close = day[day.length - 1].price;
          // toISOString() will give you YYYY-MM-DDTHH:mm:ss.sssZ
          // We only need YYYY-MM-DD
          cumulativeData.push({
            date: dateString,
            open: day[0].price,
            high: high,
            low: low,
            close: close,
            volume: volume,
            // it's a cryptocurrency, so no corporate actions to account for
            adjClose: close,
          });
        } else {
          // if there were no trades today, just use yesterday's data
          const yesterdayPrice = cumulativeData[cumulativeData.length - 1].price;
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

      console.log(tradesByDay[0]);
    
    fs.writeFile(
      path.join(filePath, `${currencyPair}.json`),
      JSON.stringify(cumulativeData),
      (err) => {
        if (err) {
          console.log(err);
        }
        console.log(`Data written to process/${currencyPair}.json!`);
      });
  });
});
