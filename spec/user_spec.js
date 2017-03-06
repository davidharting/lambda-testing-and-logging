const UserService = require('../services/user')

describe('validate()', function() {
  beforeEach(function () {
    this.validUser = {
      firstName: 'David',
      lastName: 'Harting',
      email: 'david@emplify.com',
      phone: '317-361-7847'
    }
  })

  it('should be valid with no issues for a well-formed user', function() {
    const result = UserService.validate(this.validUser)
    expect(result.isValid).toBe(true)
    expect(result.issues.length).toBe(0)
  })

  it('should be invalid if the user does not have a phone number or email', function() {
    const invalidUser = this.validUser
    delete invalidUser.email
    delete invalidUser.phone
    const result = UserService.validate(invalidUser)
    expect(result.isValid).toBe(false)
    expect(result.issues.length).toBe(1)
  })

  it('should be valid if the user has a phone number but no email', function() {
    const noPhone = this.validUser
    delete noPhone.phone
    const result = UserService.validate(noPhone)
    expect(result.isValid).toBe(true)
  })
})