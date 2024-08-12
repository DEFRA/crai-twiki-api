const { database } = require('../database')

const addSteps = async (steps) => {
  try {
    const created = await database
      .batchInsert('step', steps)
      .returning(['id', 'thread_id', 'name', 'start_time'])

    return created
  } catch (err) {
    console.error(`Error adding steps: ${err}`)

    if (err.code === '23505') {
      err.type = 'ENTITY_CONFLICT'
    }

    if (err.code === '23503') {
      err.type = 'THREAD_NOT_FOUND'
    }
    
    throw err
  }
}

const addStep = async (step) => {
  const created = await addSteps([step])

  return created[0]
}

const getStep = async (id) => {
  try {
    const steps = await database('step')
      .select({
        id: 'step.id',
        thread_id: 'step.thread_id',
        name: 'step.name',
        type: 'step.type',
        start_time: 'step.start_time',
        end_time: 'step.end_time',
        input: 'step.input',
        output: 'step.output',
        model_name: 'step.model_name',
        model_metadata: 'step.model_metadata',
        input_tokens: 'step.input_tokens',
        output_tokens: 'step.output_tokens'
      })
      .where('step.id', id)

    if (!steps.length) {
      return null
    }

    return steps[0]
  } catch (err) {
    console.error(`Error getting step: ${err}`)

    throw err
  }
}

const updateStep = async (id, step) => {
  try {
    const updated = await database('step')
      .update({
        output: step.output,
        end_time: step.end_time,
        input_tokens: step.input_tokens,
        output_tokens: step.output_tokens
      })
      .where('id', id)
      .returning(['id', 'thread_id', 'name', 'start_time', 'end_time', 'input', 'output'])

    return updated[0]
  } catch (err) {
    console.error(`Error updating step: ${err}`)

    throw err
  }
}

module.exports = {
  addSteps,
  addStep,
  getStep,
  updateStep
}
