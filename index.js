'use strict';

console.log('Loading function');

const ResponseService = require('./services/response')
const UserService = require('./services/user')
const log = require('./logger/bunyan').createLogger('Create User')
// const log = require('./logger/winston')('Create User')

/**
 * Demonstrates a simple HTTP endpoint using API Gateway. You have full
 * access to the request and response payload, including headers and
 * status code.
 */
exports.handler = (event, context, callback) => {
  try {
    log.info({ event }, 'Received event');
    log.info({ context }, 'Received context');

    switch (event.httpMethod) {
      case "POST": {
        let user
        try {
          user = JSON.parse(event.body)
        } catch (error) {
          log.error(error, 'Unable to parse request body')
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
    log.error(error, 'Unplanned exception resulting in Internal Server Error')
    return callback(null, ResponseService.composeError(500, error.message))
  }
};
