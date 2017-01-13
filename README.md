### Node.js tutorial series with express.js. Includes samples from basics to mongodb hookup and implementing loggers.

##### Following things are covered in this learning node.js series
- Node.js Basic setup
- Express.js implementation and basic setup (ch-1-4)
- Express.js API routes setup (ch-5)
- Express.js API Router and Parameters setup (ch-5)
- Setup Mongodb and use it with Express.js API (CRUD) (ch-6)
- Setup Winston error logger (ch-7)
- Setup Morgan Access logger (ch-8)
- Clustering Node.js app (ch-9)
- Serving HTML form node.js (ch-10)
- Local authentication app using node.js/express & passport.js (ch-11)
- JWT authentication for node.js API (ch-12)
- File I/O using Node.js (ch-13)
- Child_Process & Scaling Node.js (ch-14)
- Unit testing with Mocha and Chai (ch-15)

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
- We've use jsonwebtoken library to implment JWT token based authentication in API
- (Please review the read me inside this chapter for internal details)

##### Chapter-13 File I/O using Node.js
```
SN
Method & Description

1
fs.renameoldPath,newPath,callback<?XML:NAMESPACE PREFIX = "[default] http://www.w3.org/1998/Math/MathML" NS = "http://www.w3.org/1998/Math/MathML" />oldPath,newPath,callback
Asynchronous rename. No arguments other than a possible exception are given to the completion callback.

2
fs.ftruncatefd,len,callbackfd,len,callback
Asynchronous ftruncate. No arguments other than a possible exception are given to the completion callback.

3
fs.ftruncateSyncfd,lenfd,len
Synchronous ftruncate

4
fs.truncatepath,len,callbackpath,len,callback
Asynchronous truncate. No arguments other than a possible exception are given to the completion callback.

5
fs.truncateSyncpath,lenpath,len
Synchronous truncate

6
fs.chownpath,uid,gid,callbackpath,uid,gid,callback
Asynchronous chown. No arguments other than a possible exception are given to the completion callback.

7
fs.chownSyncpath,uid,gidpath,uid,gid
Synchronous chown

8
fs.fchownfd,uid,gid,callbackfd,uid,gid,callback
Asynchronous fchown. No arguments other than a possible exception are given to the completion callback.

9
fs.fchownSyncfd,uid,gidfd,uid,gid
Synchronous fchown

10
fs.lchownpath,uid,gid,callbackpath,uid,gid,callback
Asynchronous lchown. No arguments other than a possible exception are given to the completion callback.

11
fs.lchownSyncpath,uid,gidpath,uid,gid
Synchronous lchown

12
fs.chmodpath,mode,callbackpath,mode,callback
Asynchronous chmod. No arguments other than a possible exception are given to the completion callback.

13
fs.chmodSyncpath,modepath,mode
Synchronous chmod.

14
fs.fchmodfd,mode,callbackfd,mode,callback
Asynchronous fchmod. No arguments other than a possible exception are given to the completion callback.

15
fs.fchmodSyncfd,modefd,mode
Synchronous fchmod.

16
fs.lchmodpath,mode,callbackpath,mode,callback
Asynchronous lchmod. No arguments other than a possible exception are given to the completion callback.Only available on Mac OS X.

17
fs.lchmodSyncpath,modepath,mode
Synchronous lchmod.

18
fs.statpath,callbackpath,callback
Asynchronous stat. The callback gets two arguments err,statserr,stats where stats is a fs.Stats object.

19
fs.lstatpath,callbackpath,callback
Asynchronous lstat. The callback gets two arguments err,statserr,stats where stats is a fs.Stats object. lstat is identical to stat, except that if path is a symbolic link, then the link itself is stat-ed, not the file that it refers to.

20
fs.fstatfd,callbackfd,callback
Asynchronous fstat. The callback gets two arguments err,statserr,stats where stats is a fs.Stats object. fstat is identical to stat, except that the file to be stat-ed is specified by the file descriptor fd.

21
fs.statSyncpathpath
Synchronous stat. Returns an instance of fs.Stats.

22
fs.lstatSyncpathpath
Synchronous lstat. Returns an instance of fs.Stats.

23
fs.fstatSyncfdfd
Synchronous fstat. Returns an instance of fs.Stats.

24
fs.linksrcpath,dstpath,callbacksrcpath,dstpath,callback
Asynchronous link. No arguments other than a possible exception are given to the completion callback.

25
fs.linkSyncsrcpath,dstpathsrcpath,dstpath
Synchronous link.

26
fs.symlinksrcpath,dstpath[,type],callbacksrcpath,dstpath[,type],callback
Asynchronous symlink. No arguments other than a possible exception are given to the completion callback. The type argument can be set to 'dir', 'file', or 'junction' defaultis′file′defaultis′file′ and is only available on Windows ignoredonotherplatformsignoredonotherplatforms. Note that Windows junction points require the destination path to be absolute. When using 'junction', the destination argument will automatically be normalized to absolute path.

27
fs.symlinkSyncsrcpath,dstpath[,type]srcpath,dstpath[,type]
Synchronous symlink.

28
fs.readlinkpath,callbackpath,callback
Asynchronous readlink. The callback gets two arguments err,linkStringerr,linkString.

29
fs.realpathpath[,cache],callbackpath[,cache],callback
Asynchronous realpath. The callback gets two arguments err,resolvedPatherr,resolvedPath. May use process.cwd to resolve relative paths. cache is an object literal of mapped paths that can be used to force a specific path resolution or avoid additional fs.stat calls for known real paths.

30
fs.realpathSyncpath[,cache]path[,cache]
Synchronous realpath. Returns the resolved path.

31
fs.unlinkpath,callbackpath,callback
Asynchronous unlink. No arguments other than a possible exception are given to the completion callback.

32
fs.unlinkSyncpathpath
Synchronous unlink.

33
fs.rmdirpath,callbackpath,callback
Asynchronous rmdir. No arguments other than a possible exception are given to the completion callback.

34
fs.rmdirSyncpathpath
Synchronous rmdir.

35
fs.mkdirpath[,mode],callbackpath[,mode],callback
SAsynchronous mkdir22. No arguments other than a possible exception are given to the completion callback. mode defaults to 0777.

36
fs.mkdirSyncpath[,mode]path[,mode]
Synchronous mkdir.

37
fs.readdirpath,callbackpath,callback
Asynchronous readdir33. Reads the contents of a directory. The callback gets two arguments err,fileserr,files where files is an array of the names of the files in the directory excluding '.' and '..'.

38
fs.readdirSyncpathpath
Synchronous readdir. Returns an array of filenames excluding '.' and '..'.

39
fs.closefd,callbackfd,callback
Asynchronous close. No arguments other than a possible exception are given to the completion callback.

40
fs.closeSyncfdfd
Synchronous close.

41
fs.openpath,flags[,mode],callbackpath,flags[,mode],callback
Asynchronous file open.

42
fs.openSyncpath,flags[,mode]path,flags[,mode]
Synchronous version of fs.open.

43
fs.utimespath,atime,mtime,callbackpath,atime,mtime,callback

44
fs.utimesSyncpath,atime,mtimepath,atime,mtime
Change file timestamps of the file referenced by the supplied path.

45
fs.futimesfd,atime,mtime,callbackfd,atime,mtime,callback

46
fs.futimesSyncfd,atime,mtimefd,atime,mtime
Change the file timestamps of a file referenced by the supplied file descriptor.

47
fs.fsyncfd,callbackfd,callback
Asynchronous fsync. No arguments other than a possible exception are given to the completion callback.

48
fs.fsyncSyncfdfd
Synchronous fsync.

49
fs.writefd,buffer,offset,length[,position],callbackfd,buffer,offset,length[,position],callback
Write buffer to the file specified by fd.

50
fs.writefd,data[,position[,encoding]],callbackfd,data[,position[,encoding]],callback
Write data to the file specified by fd. If data is not a Buffer instance then the value will be coerced to a string.

51
fs.writeSyncfd,buffer,offset,length[,position]fd,buffer,offset,length[,position]
Synchronous versions of fs.write. Returns the number of bytes written.

52
fs.writeSyncfd,data[,position[,encoding]]fd,data[,position[,encoding]]
Synchronous versions of fs.write. Returns the number of bytes written.

53
fs.readfd,buffer,offset,length,position,callbackfd,buffer,offset,length,position,callback
Read data from the file specified by fd.

54
fs.readSyncfd,buffer,offset,length,positionfd,buffer,offset,length,position
Synchronous version of fs.read. Returns the number of bytesRead.

55
fs.readFilefilename[,options],callbackfilename[,options],callback
Asynchronously reads the entire contents of a file.

56
fs.readFileSyncfilename[,options]filename[,options]
Synchronous version of fs.readFile. Returns the contents of the filename.

57
fs.writeFilefilename,data[,options],callbackfilename,data[,options],callback
Asynchronously writes data to a file, replacing the file if it already exists. data can be a string or a buffer.

58
fs.writeFileSyncfilename,data[,options]filename,data[,options]
The synchronous version of fs.writeFile.

59
fs.appendFilefilename,data[,options],callbackfilename,data[,options],callback
Asynchronously append data to a file, creating the file if it not yet exists. data can be a string or a buffer.

60
fs.appendFileSyncfilename,data[,options]filename,data[,options]
The synchronous version of fs.appendFile.

61
fs.watchFilefilename[,options],listenerfilename[,options],listener
Watch for changes on filename. The callback listener will be called each time the file is accessed.

62
fs.unwatchFilefilename[,listener]filename[,listener]
Stop watching for changes on filename. If listener is specified, only that particular listener is removed. Otherwise, all listeners are removed and you have effectively stopped watching filename.

63
fs.watchfilename[,options][,listener]filename[,options][,listener]
Watch for changes on filename, where filename is either a file or a directory. The returned object is a fs.FSWatcher.

64
fs.existspath,callbackpath,callback
Test whether or not the given path exists by checking with the file system. Then call the callback argument with either true or false.

65
fs.existsSyncpathpath
Synchronous version of fs.exists.

66
fs.accesspath[,mode],callbackpath[,mode],callback
Tests a user's permissions for the file specified by path. mode is an optional integer that specifies the accessibility checks to be performed.

67
fs.accessSyncpath[,mode]path[,mode]
Synchronous version of fs.access. This throws if any accessibility checks fail, and does nothing otherwise.

68
fs.createReadStreampath[,options]path[,options]
Returns a new ReadStream object.

69
fs.createWriteStreampath[,options]path[,options]
Returns a new WriteStream object.

70
fs.symlinksrcpath,dstpath[,type],callbacksrcpath,dstpath[,type],callback
Asynchronous symlink. No arguments other than a possible exception are given to the completion callback. The type argument can be set to 'dir', 'file', or 'junction' defaultis′file′defaultis′file′ and is only available on Windows ignoredonotherplatformsignoredonotherplatforms. Note that Windows junction points require the destination path to be absolute. When using 'junction', the destination argument will automatically be normalized to absolute path.


```

#### Now with Docker Support
```
Build> docker build -t <imagename>:<tagnumber> .
```

```
Run> docker run -p 3000:3000 --name <containerName> <imagename>:<tagnumber>
```

```
Kill Images> docker rmi -f <imagename>
Kill Container> docker rm -f <containername>
```

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
- Crone / Task Schedular with Node.js
- Realtime Socket.io with Node.js
- Buffers and Streams in node.js

###### About me
- Bhavin Patel [https://itsmebhavin.wordpress.com]
- Google+ Collection for Advance JS [https://plus.google.com/collection/EWXpb]
