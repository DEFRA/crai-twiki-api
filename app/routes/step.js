const Joi = require('joi')
const { addStep, getStep, updateStep } = require('../repos/steps')

module.exports = [
  {
    method: 'GET',
    path: '/step/{stepId}',
    handler: async (request, h) => {
      const { stepId } = request.params

      const thread = await getStep(stepId)

      if (!thread) {
        return h.response().code(404)
      }

      return h.response(thread).code(200)
    }
  },
  {
    method: 'POST',
    path: '/step',
    options: {
      validate: {
        payload: Joi.object({
          id: Joi.string().uuid().required(),
          thread_id: Joi.string().uuid().required(),
          name: Joi.string().required(),
          type: Joi.string().required(),
          start_time: Joi.date().required(),
          end_time: Joi.date().optional(),
          input: Joi.string().required(),
          output: Joi.string().optional(),
          model_name: Joi.string().required(),
          model_metadata: Joi.object().required(),
          input_tokens: Joi.number().optional(),
          output_tokens: Joi.number().optional()
        }).required()
      }
    },
    handler: async (request, h) => {
      try {
        const thread = request.payload

        const created = await addStep(thread)

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
    path: '/step/{stepId}',
    options: {
      validate: {
        payload: Joi.object({
          end_time: Joi.date().optional(),
          output: Joi.string().optional(),
          input_tokens: Joi.number().optional(),
          output_tokens: Joi.number().optional()
        }).required()
      }
    },
    handler: async (request, h) => {
      const { stepId } = request.params

      const step = await getStep(stepId)

      if (!step) {
        return h.response().code(404)
      }

      const updated = await updateStep(stepId, request.payload)

      return h.response(updated).code(200)
    }
  }
]
