const Joi = require('joi')
const { getSession, addSession } = require('../repos/sessions')
const Session = require('../models/session')

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
          session_id: Joi.string().uuid().required(),
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

        return h.response().code(500)
      }
    }
  }
]
