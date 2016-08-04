// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express       = require('express'); // call express
var app           = express(); // define our app using express
var bodyParser    = require('body-parser');
var logger        = require('./logger');
var mongoose      = require('mongoose'); // to connect to our mongodb
var Bear          = require('./models/bear');


/******************************   MORGAN START ********************************** */
var fs = require('fs')
var morgan = require('morgan')
var path = require('path')
var logDirectory = path.join(__dirname, 'log')
// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

var accessLogStream = fs.createWriteStream(logDirectory + '/access.log', { flags: 'a' });
/* setup the logger */
app.use(morgan('tiny', { stream: accessLogStream }))

/******************************   MORGAN ENDS ********************************** */

mongoose.connect('mongodb://localhost/node_tutorial_ch6');

logger.info("Welcome to logger at " + require("moment")(new Date()).format("MM/DD/YYYY"));

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({
        message: 'hooray! welcome to our api!'
    });
});

// more routes for our API will happen here
/*
Route	HTTP Verb	Description
/api/bears	GET	Get all the bears.
/api/bears	POST	Create a bear.
/api/bears/:bear_id	GET	Get a single bear.
/api/bears/:bear_id	PUT	Update a bear with new info.
/api/bears/:bear_id	DELETE	Delete a bear.
*/
// on routes that end in /bears
// ----------------------------------------------------
router.route('/bears')
    // create a bear (accessed at POST http://localhost:8080/api/bears)
    /*Note:
            Now we have created the POST route for our application.
            We will use Express’s router.route() to handle multiple routes for
            the same URI. We are able to handle all the requests that end in /bears.
    */
    .post(function(req, res) {

        var bear = new Bear(); // create a new instance of the Bear model
        bear.name = req.body.name; // set the bears name (comes from the request)

        // save the bear and check for errors
        bear.save(function(err) {
            if (err)
                res.send(err);

            res.json({
                message: 'Bear created!'
            });
        });

    })

    // get all the bears (accessed at GET http://localhost:8080/api/bears)
    .get(function(req, res) {
        Bear.find(function(err, bears) {
            if (err)
                res.send(err);

            res.json(bears);
        });
    });

// on routes that end in /bears/:bear_id
// ----------------------------------------------------
router.route('/bears/:bear_id')
      // get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
      .get(function(req, res) {
          Bear.findById(req.params.bear_id, function(err, bear) {
              if (err)
                  res.send(err);
              res.json(bear);
          });
      })

      // update the bear with this id (accessed at PUT http://localhost:8080/api/bears/:bear_id)
    .put(function(req, res) {

        // use our bear model to find the bear we want
        Bear.findById(req.params.bear_id, function(err, bear) {

            if (err)
                res.send(err);

            bear.name = req.body.name;  // update the bears info

            // save the bear
            bear.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Bear updated!' });
            });

        });
    })

    // delete the bear with this id (accessed at DELETE http://localhost:8080/api/bears/:bear_id)
    .delete(function(req, res) {
        Bear.remove({
            _id: req.params.bear_id
        }, function(err, bear) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });





// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
