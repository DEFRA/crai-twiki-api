const Joi = require('joi')

module.exports = [
  {
    method: 'GET',
    path: '/session/{sessionId}',
    handler: async (request, h) => {
      const { projectId } = request.params

      const project = await getProject(projectId)

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
          session_id: Joi.string().uuid().optional(),
          project_id: Joi.string().uuid().required(),
          user: Joi.string().required(),
          start_time: Joi.date().required(),
          end_time: Joi.date().optional()
        }).required()
      }
    },
    handler: async (request, h) => {
      try {
        const project = Project.fromPayload(request.payload)

        const created = await addProject(project)

        return h.response(created).code(201)
      } catch (err) {
        if (err.type === 'ENTITY_CONFLICT') {
          return h.response().code(409)
        }

        return h.response().code(500)
      }
    }
  },
  {
    method: 'PATCH',
    options: {
      validate: {
        payload: Joi.object({
          end_time: Joi.date().required()
        }).required()
      }
    },
    handler: async (request, h) => {
      return h.response().code(200)
    }
  }
]
