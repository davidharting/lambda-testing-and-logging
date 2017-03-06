'use strict'

const expect = require('chai').expect
const td = require('testdouble')
const sinon = require('sinon')

const UserService = require('../../services/user')
const handler = require('../../index').handler


function createEvent(method, body) {
  return {
    httpMethod: method,
    body: JSON.stringify(body || {})
  }
}

function callback(error, success) {
  return error || success
}

describe('Create user lambda function', function(done) {
  it('should respond 400 when the request method is not POST', function(done) {
    const getResponse = handler(createEvent('GET'), {}, callback)
    expect(getResponse.statusCode, 'GET').to.equal(400)

    const putResponse = handler(createEvent('PUT'), {}, callback)
    expect(putResponse.statusCode, 'PUT').to.equal(400)

    const deleteResponse = handler(createEvent('DELETE'), {}, callback)
    expect(deleteResponse.statusCode, 'DELETE').to.equal(400)

    done()
  })

  describe('(Using testdouble)', function() {
    let validUser
    beforeEach(function() {
      validUser = {
        firstName: 'David',
        lastName: 'Harting',
        email: 'david@emplify.com',
        phone: '317-361-7847'
      }

      // Stub out function that hits the database
      td.replace(UserService, 'save', function(user) {
        user.createdAt = new Date().toISOString()
        return user
      })
    })

    afterEach(function() {
      td.reset()
    })

    it('should respond with the created user on success', function(done) {
      const response = handler(createEvent('POST', validUser), {}, callback)

      expect(response.statusCode, 'status should be 200 OK').to.equal(200)
      
      const savedUser = JSON.parse(response.body)
      expect(savedUser.createdAt, 'Saved user should have an ISO string property called createdAt').to.be.a('string')
      
      const expectedUser = validUser
      expectedUser.createdAt = savedUser.createdAt
      expect(savedUser).to.eql(expectedUser) // Deep equals

      done()
    })
  })

  describe('(Using sinon)', function() {
    let validUser
    let saveUserStub
    beforeEach(function() {
      validUser = {
        firstName: 'David',
        lastName: 'Harting',
        email: 'david@emplify.com',
        phone: '317-361-7847'
      }

      // Stub out function that hits the database
      saveUserStub = sinon.stub(UserService, 'save', function(user) {
        user.createdAt = new Date().toISOString()
        return user
      })
      // Alternatively, do not provide a function implementation, and then callback
      // saveUserStub.returns({...}) to explicitly define a return value
    })

    afterEach(function() {
      saveUserStub.restore()
    })

    it('should respond with the created user on success', function(done) {
      const response = handler(createEvent('POST', validUser), {}, callback)

      expect(response.statusCode, 'status should be 200 OK').to.equal(200)
      
      const savedUser = JSON.parse(response.body)
      expect(savedUser.createdAt, 'Saved user should have an ISO string property called createdAt').to.be.a('string')
      
      const expectedUser = validUser
      expectedUser.createdAt = savedUser.createdAt
      expect(savedUser).to.eql(expectedUser) // Deep equals

      expect(saveUserStub.calledOnce, 'We should only hit the database once').to.be.true

      done()
    })

    it('should respond with 400 if you try to save a user without phone or email', function() {
      const noContact = validUser
      delete noContact.phone
      delete noContact.email

      const response = handler(createEvent('POST', noContact), {}, callback)
      expect(response.statusCode, 'status should be 400 Bad Request').to.equal(400)

      const responseBody = JSON.parse(response.body)
      expect(responseBody).to.exist

      const errorMessage = responseBody.message
      expect(errorMessage, 'The response should contain a property message explaining the problem').to.exist

      expect(errorMessage, 'The error message should explain the problem with the contact details')
        .to.contain('email')
        .and.to.contain('phone')
    })
  })
})