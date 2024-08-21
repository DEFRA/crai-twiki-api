const Joi = require('joi')

const Step = require('../models/step')
const { addStep, getStep, updateStep } = require('../repos/steps')
const { schema } = require('../schemas/step')

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
        payload: schema
      }
    },
    handler: async (request, h) => {
      try {
        const thread = new Step(request.payload)

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
