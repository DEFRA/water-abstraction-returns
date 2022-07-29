'use strict'

const {
  experiment,
  test,
  beforeEach,
  afterEach
} = exports.lab = require('@hapi/lab').script()

const { expect } = require('@hapi/code')
const server = require('../../../index')

const { returns, versions } = require('./common')

experiment('Check versions API', () => {
  let versionId
  let returnId
  let createVersionResponse
  let deleteVersionResponse
  let returnResponse

  beforeEach(async () => {
    returnResponse = await returns.create()
    returnId = returnResponse.result.data.return_id

    createVersionResponse = await versions.create(returnId)
    versionId = createVersionResponse.result.data.version_id
  })

  afterEach(async () => {
    deleteVersionResponse = await versions.delete(versionId)
    await returns.delete(returnId)
  })

  test('The versions API should accept a new return version', async () => {
    expect(createVersionResponse.statusCode).to.equal(201)
  })

  test('The versions API should update a version', async () => {
    const request = {
      method: 'PATCH',
      url: `/returns/1.0/versions/${versionId}`,
      headers: {
        Authorization: process.env.JWT_TOKEN
      },
      payload: {
        user_type: 'external'
      }
    }
    const res = await server.inject(request)
    expect(res.statusCode).to.equal(200)

    const body = JSON.parse(res.payload)
    expect(body.data.user_type).to.equal('external')
  })

  test('The versions API should list versions for a particular return', async () => {
    const filter = {
      return_id: returnId
    }

    const request = {
      method: 'GET',
      url: `/returns/1.0/versions?filter=${JSON.stringify(filter)}`,
      headers: {
        Authorization: process.env.JWT_TOKEN
      }
    }
    const res = await server.inject(request)
    expect(res.statusCode).to.equal(200)

    const body = JSON.parse(res.payload)

    expect(body.data).to.be.an.array()
    expect(body.error).to.equal(null)
  })

  test('The versions API should delete a particular version', async () => {
    expect(deleteVersionResponse.statusCode).to.equal(200)
  })

  experiment('when creating a new version for the same return', () => {
    test('sets current to false for the old version', async () => {
      const secondVersionResponse = await versions.create(returnId, 2)
      const secondVersionId = secondVersionResponse.result.data.version_id
      await versions.delete(secondVersionId)

      // get the first version which should now have current set to false
      const firstResponse = await versions.get(versionId)

      expect(firstResponse.result.data.current).to.be.false()
    })

    test('does not set current to false if the same version is saved', async () => {
      await versions.create(returnId, 1)

      // get the first version which should still have current set to true
      const firstResponse = await versions.get(versionId)

      expect(firstResponse.result.data.current).to.be.true()
    })
  })
})
