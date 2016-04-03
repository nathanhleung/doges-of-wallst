const express = require('express');
const logger = require('morgan');
const path = require('path');
const sass = require('node-sass-middleware');

const mainCtrl = require('./controllers/main');
const stocksCtrl = require('./controllers/stocks');

const app = express();

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(sass({
  src: path.join(__dirname, 'assets'),
  dest: path.join(__dirname, 'public'),
  force: true
}));
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1y',
}));
app.use((req, res, next) => {
  res.locals.basedir = path.join(__dirname, 'views');
  next();
});

app.get('/', mainCtrl.home);

app.listen(app.get('port'), (req, res) => {
  console.log(`App running on port ${app.get('port')}`);
});
