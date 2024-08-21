const { processPayload } = require('../services/process-payload')
const { schema } = require('../schemas/payload')

module.exports = [
  {
    method: 'POST',
    path: '/payload',
    options: {
      validate: {
        payload: schema
      }
    },
    handler: async (request, h) => {
      try {
        const processed = await processPayload(request.payload)

        return h.response(processed).code(201)
      } catch (err) {
        if (err.type === 'ENTITY_CONFLICT') {
          return h.response().code(409)
        }

        return h.response().code(500)
      }
    }
  }
]
