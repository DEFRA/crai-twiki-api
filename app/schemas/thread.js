const Joi = require('joi')

const schema = Joi.object({
  id: Joi.string().uuid().required(),
  session_id: Joi.string().uuid().required(),
  name: Joi.string().required(),
  start_time: Joi.date().required(),
  end_time: Joi.date().optional(),
  input: Joi.string().required(),
  output: Joi.string().optional()
}).required()

module.exports = {
  schema
}
