const Joi = require('joi')

const schema = Joi.object({
  id: Joi.string().uuid().required(),
  project_id: Joi.string().uuid().required(),
  user: Joi.string().required(),
  start_time: Joi.date().required(),
  end_time: Joi.date().optional()
}).required()

module.exports = {
  schema
}
