const Joi = require('joi')
const { processPayload } = require('../services/process-payload')

module.exports = [
  {
    method: 'POST',
    path: '/payload',
    options: {
      validate: {
        projects: Joi.array().items(
          Joi.object({
            name: Joi.string().regex(/^[a-zA-Z0-9 ]+$/).required(),
            sessions: Joi.array().items(
              Joi.object({
                id: Joi.string().uuid().required(),
                project_id: Joi.string().uuid().required(),
                user: Joi.string().required(),
                start_time: Joi.date().required(),
                end_time: Joi.date().optional(),
                threads: Joi.array().items(
                  Joi.object({
                    id: Joi.string().uuid().required(),
                    session_id: Joi.string().uuid().required(),
                    name: Joi.string().required(),
                    start_time: Joi.date().required(),
                    end_time: Joi.date().optional(),
                    input: Joi.string().required(),
                    output: Joi.string().optional(),
                    steps: Joi.array().items(
                      Joi.object({
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
                      })
                    ).required()
                  })
                ).required()
              })
            ).required()
          })
        ).required()
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
