/*
  Process - single instance process instance
    .argv - arguments to node file
    .stdout - puting string msg on terminal
    .stdin - getting string param from terminal
    .stderr
    .exit(-1)

*/

/*
  Child_Process
    .exec -
    .spawn -
  //http://krasimirtsonev.com/blog/article/Nodejs-managing-child-processes-starting-stopping-exec-spawn
  
*/
var exec = require('child_process').exec;
exec('node -v', function(error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
        console.log('exec error: ' + error);
    }
});
