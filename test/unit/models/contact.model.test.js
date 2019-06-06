const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const Joi = require('@hapi/joi')

const lab = exports.lab = Lab.script()
const { Contact } = require('../../../server/models')

lab.experiment('Contact model: ', () => {
  let params = {
    id: 'Invalid GUID'
  }

  const config = {
    firstName: 'Fred',
    lastName: 'Blogs'
  }

  lab.test('The schema is as expected', async () => {
    const expected = ['firstName', 'lastName']
    Code.expect(Object.keys(Contact.schema).length).to.equal(expected.length)
    Code.expect(Object.keys(Contact.schema)).to.include(expected)
  })

  lab.test('The schema fails invalid input', async () => {
    const config = {
      firstName: 1234,
      lastName: true
    }

    const { error } = Joi.validate(config, Contact.schema, {
      abortEarly: false
    })

    Code.expect(error.details[0].message).to.equal('"firstName" must be a string')
    Code.expect(error.details[1].message).to.equal('"lastName" must be a string')
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
