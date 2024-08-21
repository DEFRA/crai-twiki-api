const Joi = require('joi')

const schema = Joi.object({
  name: Joi.string().regex(/^[a-zA-Z0-9 ]+$/).required()
}).required()

module.exports = {
  schema
}
