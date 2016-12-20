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
app.get('/v1/types', (req, res) => {
  res.json({
    types: [
      { label: "Food", tag: "food" },
      { label: "Restaurant", tag: "restaurant" },
      { label: "Takeaway", tag: "meal_takeaway" },
      { label: "Bar", tag: "bar" }
    ]
  })
})
module.exports = app
