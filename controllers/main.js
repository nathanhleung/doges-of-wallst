"use strict";

const PythonShell = require('python-shell');
const path = require('path');

exports.home = (req, res) => {
  res.render('home', {
    title: 'Doges of Wall Street - Algorithmic Trading for Cryptocurrencies',
    page: 'home',
  });
};

exports.algo = (req, res) => {
  res.render('algo', {
    title: 'Algorithm Console: Doges of Wall Street',
    page: 'algo',
  });
};

exports.postAlgo = (req, res) => {
  req.assert('sma-threshold', 'Percent value for SMA is not a number').isNumber();
  req.assert('seed', 'Starting portfolio is not a valid amount').isNumber();

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/algo');
  }

  const algoShell = new PythonShell('main_algo.py', {
    scriptPath: path.join(__dirname, '..', 'python-algorithm')
  });

  let moneyMade = -1;

  algoShell.on('message', function(message) {
    console.log(message);
    if (message.substr(0, 16) === "Days: You made: ") {
      moneyMade = Number(message.substr(17));
    }
  });

  // How many shares?
  algoShell.send(req.body.seed);
  // Moving average threshold
  algoShell.send(req.body['sma-threshold']);
  // Moving average duration
  algoShell.send(req.body.method.substr(-2));

  algoShell.end((err) => {
    console.log('Process terminated')
    if (err && err.exitCode !== 0) {
      res.send(err);
    } else {
      res.render('result', {
        profits: moneyMade
      })
      res.end();
    }
  });
};



