const Joi = require('joi')
const Session = require('../models/session')
const { getSession, addSession, updateSession } = require('../repos/sessions')

module.exports = [
  {
    method: 'GET',
    path: '/session/{sessionId}',
    handler: async (request, h) => {
      const { sessionId } = request.params

      const project = await getSession(sessionId)

      if (!project) {
        return h.response().code(404)
      }

      return h.response(project).code(200)
    }
  },
  {
    method: 'POST',
    path: '/session',
    options: {
      validate: {
        payload: Joi.object({
          id: Joi.string().uuid().required(),
          project_id: Joi.string().uuid().required(),
          user: Joi.string().required(),
          start_time: Joi.date().required(),
          end_time: Joi.date().optional()
        }).required()
      }
    },
    handler: async (request, h) => {
      try {
        const session = Session.fromPayload(request.payload)

        const created = await addSession(session)

        return h.response(created).code(201)
      } catch (err) {
        if (err.type === 'ENTITY_CONFLICT') {
          return h.response().code(409)
        }

        if (err.type === 'PROJECT_NOT_FOUND') {
          return h.response({ error: 'Project ID not found' }).code(400)
        }

        return h.response().code(500)
      }
    }
  },
  {
    method: 'PATCH',
    path: '/session/{sessionId}',
    options: {
      validate: {
        payload: Joi.object({
          end_time: Joi.date().required()
        }).required()
      }
    },
    handler: async (request, h) => {
      const { sessionId } = request.params

      const session = await getSession(sessionId)

      if (!session) {
        return h.response().code(404)
      }

      const updated = await updateSession(sessionId, request.payload)

      return h.response(updated).code(200)
    }
  }
]
