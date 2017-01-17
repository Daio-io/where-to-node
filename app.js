const express = require('express');
const config = require('./config')
const path = require('path');
const logger = require('morgan');
const app = express();
const places = require('./routes/places');
const http = require('http');

app.use(logger('dev'));
app.use('/v1/location', places);
app.get("/status", (req, res) => {
  res.send("OK")
})
app.get('/v1/types', (req, res) => {
  res.json({
    types: [
      { label: "Food", tag: "food" },
      { label: "Restaurant", tag: "restaurants" },
      { label: "Takeaway", tag: "fooddeliveryservices" },
      { label: "Bar", tag: "bars" }
    ]
  })
})

app.use((req, res, next) => {
  res.set('Cache-Control', `max-age=${config.CACHE}`);
  next()
});

const server = http.createServer(app);

function startServer() {
  server.listen(config.PORT, () => {
    console.log('WhereTo Api started on port:', config.PORT);
  });

}

if (require.main === module) {
  startServer();
} else {
  module.exports = startServer();
}
