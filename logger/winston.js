const winston = require('winston')
const _ = require('lodash')

// Requiring `winston-loggly` will expose `winston.transports.Loggly`
require('winston-loggly')

function addSharedMetadata(level, msg, meta) {
    return _.assign({}, meta, {
      extraField: 'This will be the same on all records',
      env: _.pickBy(process.env, function(value, key) {
        return key.toLowerCase().startsWith('npm') || key.toLowerCase().startsWith('node')
      }),
    })
}

// Naming loggers doesn't appear to be a thing in Winston. So we will just have one logger
// Shared by everything that imports this
exports.createLogger = function(tag) {
  return new winston.Logger({
    transports: [
      new (winston.transports.Console)({ level: 'debug' }),
      new (winston.transports.Loggly)({ 
        level: 'info',
        subdomain: 'emplify',
        inputToken: 'adb0a9f7-9662-4bfb-a8ed-5748bbccde3e',
        tags: [ tag ],
        json: true
      })
    ],
    rewriters: [
      addSharedMetadata
    ]
  })
}
