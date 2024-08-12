const { database } = require('../database')

const addThreads = async (threads) => {
  try {
    const created = await database
      .batchInsert('thread', threads)
      .returning(['id', 'session_id', 'name', 'start_time', 'input'])

    return created
  } catch (err) {
    console.error(`Error adding sessions: ${err}`)

    if (err.code === '23505') {
      err.type = 'ENTITY_CONFLICT'
    }

    if (err.code === '23503') {
      err.type = 'SESSION_NOT_FOUND'
    }
    
    throw err
  }
}

const addThread = async (thread) => {
  const created = await addThreads([thread])

  return created[0]
}

const getThread = async (id) => {
  try {
    const threads = await database('thread')
      .select({
        id: 'thread.id',
        session_id: 'thread.session_id',
        name: 'thread.name',
        start_time: 'thread.start_time',
        end_time: 'thread.end_time',
        input: 'thread.input',
        output: 'thread.output',
        step_id: 'step.id',
        thread_id: 'step.thread_id',
        step_name: 'step.name',
        type: 'step.type',
        step_start_time: 'step.start_time',
        step_end_time: 'step.end_time',
        step_input_tokens: 'step.input_tokens',
        step_output_tokens: 'step.output_tokens'
      })
      .leftJoin('step', 'thread.id', 'step.thread_id')
      .where('thread.id', id)

    if (!threads.length) {
      return null
    }

    const thread = threads.reduce((acc, curr) => {
      if (!acc.id) {
        acc.id = curr.id
        acc.session_id = curr.session_id
        acc.name = curr.name
        acc.start_time = curr.start_time
        acc.end_time = curr.end_time
        acc.input = curr.input
        acc.output = curr.output
        acc.steps = []
      }

      if (curr.step_id) {
        acc.steps.push({
          id: curr.step_id,
          thread_id: curr.thread_id,
          name: curr.step_name,
          type: curr.type,
          start_time: curr.step_start_time,
          end_time: curr.step_end_time,
          input_tokens: curr.step_input_tokens,
          output_tokens: curr.step_output_tokens
        })
      }

      return acc
    }, {})

    return thread
  } catch (err) {
    console.error(`Error getting thread: ${err}`)

    throw err
  }
}

const updateThread = async (id, thread) => {
  try {
    const updated = await database('thread')
      .update({
        end_time: thread.end_time,
        output: thread.output
      })
      .where('id', id)
      .returning(['id', 'session_id', 'name', 'start_time', 'end_time', 'input', 'output'])

    return updated[0]
  } catch (err) {
    console.error(`Error updating thread: ${err}`)

    throw err
  }
}

module.exports = {
  addThreads,
  addThread,
  getThread,
  updateThread
}
