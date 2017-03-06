const winston = require('winston')
const _ = require('lodash')

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
exports.logger = new winston.Logger({
  transports: [
    new (winston.transports.Console)({ level: 'debug' })
  ],
  rewriters: [
    addSharedMetadata
  ]
})
