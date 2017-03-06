const _ = require('lodash') 

exports.validate = function(user) {
    const issues = []
    if (!user.email && !user.phone) {
        issues.push('A user must have a phone number and/or email address')
    }
    return { 
        isValid: issues.length === 0,
        issues 
    }
}

exports.save = function(user) {
    // We pretend that this makes a call to the database and returns the object as it appears in the row
    throw new Error('Database connection error') 
    // return _.assign({}, user, { createdAt: new Date().toISOString() })
}
