const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const indexRoute = require('./routes/index');
const dictionaryRoute = require('./routes/dictionary');
const config = require('./config');

const app = express();

mongoose.connect(config.connectionString);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-browser-identifier');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

app.use('/dictionary', dictionaryRoute);
app.use('/', indexRoute);

module.exports = app;
