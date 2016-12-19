const express = require('express');
const path = require('path');
const logger = require('morgan');
const app = express();
const places = require('./routes/places');

app.use(logger('dev'));
app.use('/v1/location', places);
app.get("/status", (req, res) => {
  res.send("OK")
})
module.exports = app
