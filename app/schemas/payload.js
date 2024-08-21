const Joi = require('joi')

const { schema: step } = require('./step')
const { schema: threadSchema } = require('./thread')
const { schema: sessionSchema } = require('./session')
const { schema: projectSchema } = require('./project')

const thread = threadSchema.keys({
  steps: Joi.array().items(step).required()
})

const session = sessionSchema.keys({
  threads: Joi.array().items(thread).required()
})

const project = projectSchema.keys({
  sessions: Joi.array().items(session).required()
})

const schema = Joi.object({
  projects: Joi.array().items(project).required()
})

module.exports = {
  schema
}
