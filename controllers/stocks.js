// const intraday = require('intraday');
// const historic = require('historic');

const request = require('request');

exports.ticker = (req, res) => {
  const currA = req.params.currA.toLowerCase();
  const currB = req.params.currB.toLowerCase();
  request(`http://data.bter.com/api/1/ticker/${currA}_${currB}`,
    (err, response, body) => {
      if (err) {
        res.send(err);
      }
      res.json(body);
    });
};

exports.depth = (req, res) => {
  const currA = req.params.currA.toLowerCase();
  const currB = req.params.currB.toLowerCase();
  request(`http://data.bter.com/api/1/ticker/${currA}_${currB}`,
    (err, response, body) => {
      if (err) {
        res.send(err);
      }
      res.json(body);
    });
};

exports.tickers = (req, res) => {
  request('http://data.bter.com/api/1/pairs', (err, response, body) => {
    if (err) {
      res.send(err);
    }
    res.json(body);
  });
};
