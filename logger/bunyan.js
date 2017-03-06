const bunyan = require('bunyan')
const bunyan2loggly = require('bunyan-loggly')

exports.createLogger = function(name) {
  const logglyConfig = {
    token: 'adb0a9f7-9662-4bfb-a8ed-5748bbccde3e',
    subdomain: 'emplify',
    tags: [ name ]
  }

  // It's possible for this construction to throw an error and make the function not run
  const logglyStream = new bunyan2loggly(logglyConfig)

  const log = bunyan.createLogger({ 
    name,
    // Fields to be appended to every log record
    extraField: 'This will be the same on all records',
    env: process.env,
    // Where shall we pipe the logs?
    streams: [
      {
        type: "raw",
        stream: logglyStream,
        level: 'info'
      },
      {
        stream: process.stdout,
        level: 'info'
      }
    ]
  })
  return log
}