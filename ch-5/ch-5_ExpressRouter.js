var birds = require('./birds');
var express = require('express');
var app = express();

app.use('/api/birds',birds);

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
