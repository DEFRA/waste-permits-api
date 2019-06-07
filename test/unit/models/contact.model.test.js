const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const Joi = require('@hapi/joi')
const uuid = require('uuid/v1')

const lab = exports.lab = Lab.script()
const { Contact } = require('../../../server/models')

lab.experiment('Contact model: ', () => {
  let params = {
    id: 'Invalid GUID'
  }

  const config = {
    firstName: 'Fred',
    lastName: 'Blogs',
    applicationId: uuid(),
    customerId: uuid(),
    type: 'abc',
    jobTitle: 'Director',
    email: 'ben@test.defra.gov',
    dateOfBirth: '1999-1-1',
    telephone: '043034504',
    addressId: uuid(),
    organisationType: 'abc',
    fullAddress: '21 Fake Street'
  }

  lab.test('The schema is as expected', async () => {
    const expected = [
      'firstName',
      'lastName',
      'applicationId',
      'customerId',
      'type',
      'jobTitle',
      'email',
      'dateOfBirth',
      'telephone',
      'addressId',
      'organisationType',
      'fullAddress'
    ]
    Code.expect(Object.keys(Contact.schema).length).to.equal(expected.length)
    Code.expect(Object.keys(Contact.schema)).to.include(expected)
  })

  lab.test('The schema fails invalid input', async () => {
    const config = {
      firstName: 1234,
      lastName: true,
      applicationId: 'abc',
      customerId: 1234,
      type: false,
      jobTitle: 123,
      email: 'abc@def',
      dateOfBirth: 'sdfsf',
      telephone: true,
      addressId: 'sdff',
      organisationType: true,
      fullAddress: false
    }

    const { error } = Joi.validate(config, Contact.schema, {
      abortEarly: false
    })

    const errors = error.details.map(({ message }) => message)

    Code.expect(errors[0]).to.equal('"firstName" must be a string')
    Code.expect(errors[1]).to.equal('"lastName" must be a string')
    Code.expect(errors[2]).to.equal('"applicationId" must be a valid GUID')
    Code.expect(errors[3]).to.equal('"customerId" must be a string')
    Code.expect(errors[4]).to.equal('"type" must be a string')
    Code.expect(errors[5]).to.equal('"jobTitle" must be a string')
    Code.expect(errors[6]).to.equal('"email" must be a valid email')
    Code.expect(errors[7]).to.equal('"dateOfBirth" must be a number of milliseconds or valid date string')
    Code.expect(errors[8]).to.equal('"telephone" must be a string')
    Code.expect(errors[9]).to.equal('"addressId" must be a valid GUID')
    Code.expect(errors[10]).to.equal('"organisationType" must be a string')
    Code.expect(errors[11]).to.equal('"fullAddress" must be a string')
  })

  lab.test('The schema passes valid input', async () => {
    const { error } = Joi.validate(config, Contact.schema, {
      abortEarly: false
    })

    Code.expect(error).to.equal(null)
  })

  lab.test('Add an contact', async () => {
    let contact = new Contact(config)

    const { id } = await contact.save()

    const { error } = Joi.validate({ id }, Contact.params, {
      abortEarly: false
    })

    Code.expect(error).to.equal(null)

    // Save the id for use in the next test
    params.id = id
  })

  lab.test('Update an contact', async () => {
    // Find the contact using the id created in the previous test
    let contact = await Contact.getById(params.id)

    contact.firstName = 'James'
    const { firstName } = await contact.save()

    Code.expect(firstName).to.equal(contact.firstName)
  })

  lab.test('Load all contacts', async () => {
    // Find the contact using the id created in the previous test
    let contacts = await Contact.getAll()

    let contact = contacts.find(({ id }) => id === params.id)

    Code.expect(contact).to.exist()
  })

  lab.test('Delete an contact', async () => {
    // Find the contact using the id created in a previous test
    let contact = await Contact.getById(params.id)
    const result = await contact.delete()

    Code.expect(result).to.equal(true)
  })
})
