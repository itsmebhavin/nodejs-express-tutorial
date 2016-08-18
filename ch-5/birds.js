var express = require('express');
var router = express.Router();

// middleware that is specific to this router
// How Interceptor Works ?
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});



// define the home page route
//http://localhost:3000/api/birds/
router.get('/', function(req, res) {
  res.send('Birds home page');
});



// define the about route
//http://localhost:3000/api/birds/about
router.get('/about', function(req, res) {
  res.send('About birds');
});

module.exports = router;
