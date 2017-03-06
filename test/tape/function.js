const test = require('tape')
const handler = require('../../index').handler

function createEvent(method, body) {
    if (!body) {
        body = {}
    }
    return {
        httpMethod: method,
        body: JSON.stringify(body)
    }
}

/**
 * 
 */
function callback(error, success) {
    return error || success
}

test('The function should respond 400 Bad Request if any header besides POST is used', function (assert) {
    const getResponse = handler(createEvent("GET"), {}, callback)
    assert.equal(getResponse.statusCode, 400, 'GET')
    
    const putResponse = handler(createEvent('PUT'), {}, callback)
    assert.equal(putResponse.statusCode, 400, 'PUT')
    
    assert.end()
})

test('Should respond 400 if the request body is not JSON parseable', function (assert) {
    const event = {
        httpMethod: 'POST',
        body: 'this is not valid JSON'
    }
    const response = handler(event, {}, callback)
    assert.equal(response.statusCode, 400)
    assert.end()
})

test('Should respond 200 if the user is saved', function (assert) {
    const validUser = {
        name: 'David',
        email: 'david@emplify.com'
    }
    const response = handler(createEvent('POST', validUser), {}, callback)
    console.log(response)
    assert.equal(response.statusCode, 200)
    assert.end()
})