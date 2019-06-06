const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const Joi = require('@hapi/joi')
const uuid = require('uuid/v1')

const lab = exports.lab = Lab.script()
const { Application } = require('../../../server/models')

lab.experiment('Application model: ', () => {
  let params = {
    id: 'Invalid GUID'
  }

  const config = {
    categoryId: uuid(),
    contactId: uuid()
  }

  lab.test('The schema is as expected', async () => {
    const expected = ['categoryId', 'contactId']
    Code.expect(Object.keys(Application.schema).length).to.equal(expected.length)
    Code.expect(Object.keys(Application.schema)).to.include(expected)
  })

  lab.test('The schema fails invalid input', async () => {
    const config = {
      categoryId: 'Invalid GUID',
      contactId: 'Invalid GUID'
    }

    const { error } = Joi.validate(config, Application.schema, {
      abortEarly: false
    })

    Code.expect(error.details[0].message).to.equal('"categoryId" must be a valid GUID')
    Code.expect(error.details[1].message).to.equal('"contactId" must be a valid GUID')
  })

  lab.test('The schema passes valid input', async () => {
    const { error } = Joi.validate(config, Application.schema, {
      abortEarly: false
    })

    Code.expect(error).to.equal(null)
  })

  lab.test('Add an application', async () => {
    let application = new Application(config)

    const { id } = await application.save()

    const { error } = Joi.validate({ id }, Application.params, {
      abortEarly: false
    })

    Code.expect(error).to.equal(null)

    // Save the id for use in the next test
    params.id = id
  })

  lab.test('Update an application', async () => {
    // Find the application using the id created in the previous test
    let application = await Application.getById(params.id)

    application.contactId = uuid()
    const { contactId } = await application.save()

    Code.expect(contactId).to.equal(application.contactId)
  })

  lab.test('Load all applications', async () => {
    // Find the application using the id created in the previous test
    let applications = await Application.getAll()

    let application = applications.find(({ id }) => id === params.id)

    Code.expect(application).to.exist()
  })

  lab.test('Delete an application', async () => {
    // Find the application using the id created in a previous test
    let application = await Application.getById(params.id)
    const result = await application.delete()

    Code.expect(result).to.equal(true)
  })
})
