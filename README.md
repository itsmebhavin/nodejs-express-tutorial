### Node.js tutorial series with express.js. Includes samples from basics to mongodb hookup and implementing loggers.

##### Following things are covered in this learning node.js series
- Node.js Basic setup
- Express.js implementation and basic setup
- Express.js API routes setup
- Express.js API Router and Parameters setup
- Setup Mongodb and use it with Express.js API (CRUD)
- Setup Winston error logger
- Setup Morgan Access logger
- Clustering Node.js app
- Local authentication app using node.js/express & passport.js
- Serving HTML form node.js
- JWT authentication for node.js API

##### Follow these steps to use
1. Download and install dependencies
    ```
    npm install
    ```
2. goto specifig file for each chapter & run with node
    ```
    e.g.
    $ node ch-1_BasicHttp.js
    $ node ch-4_ExpressGetPost.js

    or
    cd ch-7
    $ node server.js
    ```
3. You may use it with nodemon as well if you are editting

#### Chapters Introduction
#####   Chapter-1 Basis Http Setup
.
```
var http = require('http');

// Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.end("Hello World\n");
});
```

##### Chapter-2 Basic TCP Setup
.
```
var net = require('net');

// Creates a new TCP server. The handler argument is automatically set as a listener for the 'connection' event
var server = net.createServer(function (socket) {

  // Every time someone connects, tell them hello and then close the connection.
  console.log("Connection from " + socket.remoteAddress);
  socket.end("Hello Node from TCP\n");

});
```
##### Chapter-3 Basic Express.js Setup
.
```
var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

```
##### Chapter-4 Express.js API Routes
.
```
app.get('/', function (req, res) {
  res.send('root');
});

app.get('/about', function (req, res) {
  res.send('about');
});
app.get('flights/:from-:to', function(req, res) {
  res.send(req.params);
});

app.get('plantae/:type.:species', function(req, res) {
  res.send(req.params);
});
```
##### Chapter-5 Express.js External Factory Router Setup
.
```
//Bird.js
var express = require('express');
var router = express.Router();
// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});
// define the home page route
router.get('/', function(req, res) {
  res.send('Birds home page');
});
// define the about route
router.get('/about', function(req, res) {
  res.send('About birds');
});

module.exports = router;

```
and then in main server.js/app.js
```
var birds = require('./birds');
var express = require('express');
var app = express();
app.use('/api/birds',birds); //This is important to do DI
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
```
##### Chapter-6 Working with Mongodb & Express.js for CRUD API
.

- Install mongodb [https://scotch.io/tutorials/an-introduction-to-mongodb]
- start process in terminal $ mongod (this will start instance of mongodb)
- start server in another terminal $ mongo (   this will start db server instance)

```  
//Install & connect with mongoose
var mongoose = require('mongoose'); // to connect to our mongodb
mongoose.connect('mongodb://localhost/node_tutorial_ch6');
```
We have implmentation of following Express.js Routes in Chapter-6 folder
```
Route	HTTP Verb	Description
/api/bears	GET	Get all the bears.
/api/bears	POST	Create a bear.
/api/bears/:bear_id	GET	Get a single bear.
/api/bears/:bear_id	PUT	Update a bear with new info.
/api/bears/:bear_id	DELETE	Delete a bear.
```
##### Chapter-7 Winston logger for errors
.
```
//Logger.js
var winston = require('winston');
winston.emitErrs = true;
var logger = new(winston.Logger)({
        transports: [
            new(winston.transports.Console)(),
            new(winston.transports.File)({
                filename: 'error' + require("moment")(new Date()).format("MMDDYYYY") + '.log'
            })
        ]
    });
module.exports = logger;
```
and then in main file -
```
var logger        = require('./logger');
...
...
logger.info("Welcome to logger at " + require("moment")(new Date()).format("MM/DD/YYYY"));
...
```
##### Chapter-8 Morgan logger for access log
.
```
var fs = require('fs')
var morgan = require('morgan')
var path = require('path')
var logDirectory = path.join(__dirname, 'log')

fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
var accessLogStream = fs.createWriteStream(logDirectory + '/access.log', { flags: 'a' });
/* setup the logger */
app.use(morgan('tiny', { stream: accessLogStream }));
```
##### Chapter-9 Clustering in Node.js
.
```
//Basic clustering
var cluster = require('cluster');
var http = require('http');

if (cluster.isMaster) {
  var numCPUs = require('os').cpus().length;
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  Object.keys(cluster.workers).forEach(function(id) {
    console.log(cluster.workers[id].process.pid);
  });
} else{

   require("./server.js");
}
```
and for more advance usage for clustering -

```
var cluster = require('cluster');
var http = require('http');

if (cluster.isMaster) {

  console.log("Master pid: " + process.pid);

  var numberOfRequests = 0;

  var numCPUs = require('os').cpus().length;
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  Object.keys(cluster.workers).forEach(function(id) {
    console.log('creating process with id = ' + cluster.workers[id].process.pid);

    //getting message
    cluster.workers[id].on('message', function messageHandler(msg) {
      if (msg.cmd && msg.cmd == 'notifyRequest') {
        numberOfRequests += 1;
      }

      console.log("Getting message from process : ", msg.procId);
    });

    //Getting worker online
    cluster.workers[id].on('online', function online()
    {
      console.log("Worker pid: " + cluster.workers[id].process.pid + " is online");
    });

    //printing the listening port
    cluster.workers[id].on('listening', function online(address)
    {
      console.log("Listening on port + " , address.port);
    });

    //Catching errors
    cluster.workers[id].on('exit', function(code, signal) {
      if( signal ) {
        console.log("worker was killed by signal: "+signal);
      } else if( code !== 0 ) {
        console.log("worker exited with error code: "+code);
      } else {
        console.log("worker success!");
      }
    });
  });

  //Printing number of requests
  setInterval(function(){
    console.log("Handled " + numberOfRequests + " requests");
  }, 3000);

} else {

  require('./server.js')
}

```
##### Chapter-10 Serving Html file from node
.
```
var express = require('express');
var app = express();
var path = require('path');

// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});
app.listen(8080);
console.log("Server is running at http://localhost:8080 ...");

```
##### Chapter-11 Local authentication with node.js using Passport.js
- We've used passport.js, Express.js & EJS templates for making this sample for basic login and signup system.
- (Please review the read me inside this chapter for internal details)

##### Chapter-12 Token Based authentication for node.js API


#### NPM/Node modules versioning

- latest =	Takes the latest version possible. Not the safest thing to use.
- *, x	= Wildcards. Can be any version at all. Crazy stuff.
- 4, 4.*, 4.x, ~4, ^4	= Any version that starts with 4. Takes the latest.
- ">4.8.5"	= Choose any version greater than a specific version. Could break your application.
- <4.8.5	= Choose any version lower than a specific version.
- ">=4.8.5"	 = Anything greater than or equal to a specific version.
- <=4.8.5	= Anything less than or equal to.
- 4.8.3 - 4.8.5	 = Anything within a range of versions. The equivalent of >=4.8.3 and <=4.8.5
- ~4.8.5	= Any version “reasonably close to 4.8.5”. This will call use all versions up to, but less than 4.9.0
- ~4.8	= Any version that starts with 4.8
- ^4.8.5	= Any version “compatible with 4.8.5”. This will call versions up to the next major version like 5.0.0. Could break your application if there are major differences in the next major version.
- ~1.2	= Any version compatible with 1.2


#### TODOs
- Accessing SQL Server
- Accessing SQLite
- Crone / Task Schedular with Node.js
- Realtime Socket.io with Node.js
- Testing with Mocha & Chai

###### About me
- Bhavin Patel [https://itsmebhavin.wordpress.com]
- Google+ Collection for Advance JS [https://plus.google.com/collection/EWXpb]
