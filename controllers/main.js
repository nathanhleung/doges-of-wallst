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
  
  res.send(req.body);
};



