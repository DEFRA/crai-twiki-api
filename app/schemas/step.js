const Joi = require('joi')

const schema = Joi.object({
  id: Joi.string().uuid().required(),
  thread_id: Joi.string().uuid().required(),
  name: Joi.string().required(),
  type: Joi.string().required(),
  start_time: Joi.date().required(),
  end_time: Joi.date().optional(),
  input: Joi.string().required(),
  output: Joi.string().optional(),
  model_name: Joi.string().optional(),
  model_metadata: Joi.object().optional(),
  input_tokens: Joi.number().optional(),
  output_tokens: Joi.number().optional()
}).required()

module.exports = {
  schema
}
