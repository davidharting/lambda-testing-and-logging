'use strict'

const handler = require('../index').handler
const UserService = require('../services/user')
const _ = require('lodash')

describe('The lambda function for creating a new user', function() {
  let callback
  let createEvent
  let validUser

  beforeEach(function() {
    callback = function(error, success) {
      return error || success
    }
    
    createEvent = function(method, body) {
      if (!body) {
        body = {}
      }
      return {
        httpMethod: method,
        body: JSON.stringify(body)
      }
    }

    validUser = {
      firstName: 'David',
      lastName: 'Harting',
      email: 'david@emplify.com',
      phone: '317-361-7847'
    }
    spyOn(UserService, 'save')
      .and
      .callFake(function fakeSave(user) {
        return _.assign({}, user, { createdAt: new Date().toISOString() })
      })
  })
  
  describe('invalid methods', function() {
    it('should respond 400 for a GET', function() {
      const result = handler(createEvent('GET'), {}, callback)
      expect(result.statusCode).toBe(400)
    })

    it('should respond 400 for a PUT', function() {
      const result = handler(createEvent('PUT'), {}, callback)
      expect(result.statusCode).toBe(400)
    })
  })
  
  it('should respond with the updated user object on success', function() {
    const result = handler(createEvent('POST', validUser), {}, callback);
    expect(UserService.save).toHaveBeenCalled();
    expect(result.statusCode).toBe(200);
    const createdUser = JSON.parse(result.body);
    expect(createdUser.createdAt).toBeDefined();
  })
})