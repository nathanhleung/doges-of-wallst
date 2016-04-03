exports.home = (req, res) => {
  res.render('home', {
    title: 'Algo Trader',
    page: 'home',
  });
};
