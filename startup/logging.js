const winston = require('winston');

module.exports = function() {
  //Exception handling
  winston.exceptions.handle(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: './logs/uncaughtExceptions.log' })
  );
  process.on('unhandledRejection', ex => {
    winston.error(ex.message, ex);
  });

  winston.add(new winston.transports.File({ filename: './logs/logfile.log' }));
};
