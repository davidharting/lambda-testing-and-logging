exports.composeError = function(statusCode, message) {
    return {
        statusCode,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message
        })
    }
}
