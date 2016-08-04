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


/* OTHER OPTIONS WITH Winston

// setup default logger (no category)
winston.loggers.add('default', {
    console: {
        colorize: 'true',
        handleExceptions: true,
        json: false,
        level: 'silly',
        label: 'default',
    },
    file: {
        filename: 'some/path/where/the/log/file/reside/default.log',
        level: 'silly',
        json: false,
        handleExceptions: true,
    },
});

//
// setup logger for category `usersessions`
// you can define as many looggers as you like
//
winston.loggers.add('usersessions', {
    console: {
        level: 'silly',
        colorize: 'true',
        label: 'usersessions',
        json: false,
        handleExceptions: true,
    },
    file: {
        filename: 'some/path/where/the/log/file/reside/usersessions.log',
        level: 'silly',
        json: false,
        handleExceptions: true,
    },
});

*/
