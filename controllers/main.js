exports.home = (req, res) => {
  res.render('home', {
    title: 'Doges of Wall Street - Algorithmic Trading for Cryptocurrencies',
    page: 'home',
  });
};
