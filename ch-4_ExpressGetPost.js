/*
Response methods
The methods on the response object (res) in the following table can send a response to the client, and terminate the request-response cycle. If none of these methods are called from a route handler, the client request will be left hanging.

        Method	          Description
        res.download()  	Prompt a file to be downloaded.
        res.end()	        End the response process.
        res.json()	      Send a JSON response.
        res.jsonp()	      Send a JSON response with JSONP support.
        res.redirect()	   Redirect a request.
        res.render()	     Render a view template.
        res.send()	       Send a response of various types.
        res.sendFile()	   Send a file as an octet stream.
        res.sendStatus()	 Set the response status code and send its string representation as the response body.

*/

var express = require('express');
var app = express();

/* SIMPLE GET REQUESTS DEMO */

app.get('/', function (req, res) {
  res.send('root');
});

app.get('/about', function (req, res) {
  res.send('about');
});

app.get('/random.text', function (req, res) {
  res.send('random.text');
});


/*
  ROUTE PARAMS DEMO
  Route path: /users/:userId/books/:bookId
  Request URL: http://localhost:3000/users/34/books/8989
  req.params: { "userId": "34", "bookId": "8989" }
*/
app.get('/users/:userId/books/:bookId', function(req, res) {
  res.send(req.params);
});

/*
  Since the hyphen (-) and the dot (.) are interpreted literally, they can be used
  along with route parameters for useful purposes.

  Route path: /flights/:from-:to
  Request URL: http://localhost:3000/flights/LAX-SFO
  req.params: { "from": "LAX", "to": "SFO" }

  Route path: /plantae/:genus.:species
  Request URL: http://localhost:3000/plantae/Prunus.persica
  req.params: { "genus": "Prunus", "species": "persica" }
*/


app.get('/flights/:from-:to', function(req, res) {
  res.send(req.params);
});

app.get('/plantae/:type.:species', function(req, res) {
  res.send(req.params);
});


/*
    ROUTE HANDLERS DEMO
*/
app.get('/example/a', function (req, res) {
  res.send('Hello from A!');
});

app.get('/example/b', function (req, res, next) {
  console.log('the response will be sent by the next function ...');
  next();
}, function (req, res) {
  res.send('Hello from B!');
});


/* COMBINE ROUTE for ONE REST OBJ - DEMO */
app.route('/book')
  .get(function(req, res) {
    res.send('Get a random book');
  })
  .post(function(req, res) {
    res.send('Add a book');
  })
  .put(function(req, res) {
    res.send('Update the book');
  });




app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
