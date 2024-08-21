const Joi = require('joi')

const Thread = require('../models/thread')
const { getThread, addThread, updateThread } = require('../repos/threads')
const { schema } = require('../schemas/thread')

module.exports = [
  {
    method: 'GET',
    path: '/thread/{threadId}',
    handler: async (request, h) => {
      const { threadId } = request.params

      const thread = await getThread(threadId)

      if (!thread) {
        return h.response().code(404)
      }

      return h.response(thread).code(200)
    }
  },
  {
    method: 'POST',
    path: '/thread',
    options: {
      validate: {
        payload: schema
      }
    },
    handler: async (request, h) => {
      try {
        const thread = new Thread(request.payload)

        const created = await addThread(thread)

        return h.response(created).code(201)
      } catch (err) {
        if (err.type === 'ENTITY_CONFLICT') {
          return h.response().code(409)
        }

        if (err.type === 'SESSION_NOT_FOUND') {
          return h.response({ error: 'Session ID not found' }).code(400)
        }

        return h.response().code(500)
      }
    }
  },
  {
    method: 'PATCH',
    path: '/thread/{threadId}',
    options: {
      validate: {
        payload: Joi.object({
          end_time: Joi.date().optional(),
          output: Joi.string().optional()
        }).required()
      }
    },
    handler: async (request, h) => {
      const { threadId } = request.params

      const thread = await getThread(threadId)

      if (!thread) {
        return h.response().code(404)
      }

      const updated = await updateThread(threadId, request.payload)

      return h.response(updated).code(200)
    }
  }
]
