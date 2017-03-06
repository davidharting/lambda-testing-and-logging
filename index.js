'use strict';

console.log('Loading function');

const ResponseService = require('./services/response')
const UserService = require('./services/user')
const bunyan = require('./logger/bunyan').createLogger('Create User')
const winston = require('./logger/winston').logger

/**
 * Demonstrates a simple HTTP endpoint using API Gateway. You have full
 * access to the request and response payload, including headers and
 * status code.
 */
exports.handler = (event, context, callback) => {
  try {
    // In Bunyan, you can lead with an object which will be added to your JSON log entry property-by-property
    // Then, your message will be added to your log on the `msg` property
    // bunyan.info({ event }, 'Received event');
    // With winston, you can log "metadata objects" after your message
    winston.info('Received event', event)
    // bunyan.info({ context }, 'Received context');
    winston.info('Received context', context)

    switch (event.httpMethod) {
      case "POST": {
        let user
        try {
          user = JSON.parse(event.body)
        } catch (error) {
          // bunyan.error(error, 'Unable to parse request body')
          winston.error('Unable to parse request body', error)
          return callback(null, ResponseService.composeError(400, 'Unable to parse request body'))
        }

        const validationResult = UserService.validate(user)
        if (validationResult.isValid) {
          const savedUser = UserService.save(user)
          return callback(null, {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(savedUser)
          })
        }

        return callback(null, ResponseService.composeError(400, validationResult.issues.join('\n')))
      }
      default: {
        return callback(null, {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: `Unsupported method ${event.httpMethod}`})
        })
      }
    }
  } catch (error) {
    // bunyan.error(error, 'Unplanned exception resulting in Internal Server Error')
    winston.error('Unplanned exception resulting in Internal Server Error', error)
    return callback(null, ResponseService.composeError(500, error.message))
  }
};
