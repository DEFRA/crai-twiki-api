const { database } = require('../database')
const Thread = require('../models/thread')

/**
 * Add multiple threads to datastore
 * 
 * @param {Thread[]} threads 
 * @returns {Promise<Thread[]>}
 */
const addThreads = async (threads) => {
  const data = threads.map(thread => ({
    id: thread.id,
    session_id: thread.session_id,
    name: thread.name,
    start_time: thread.start_time,
    end_time: thread.end_time,
    input: thread.end_time,
    output: thread.output
  }))

  try {
    const created = await database
      .batchInsert('thread', data)
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

/**
 * Add a single thread to datastore
 * 
 * @param {Thread} thread 
 * @returns {Promise<Thread>}
 */
const addThread = async (thread) => {
  const created = await addThreads([thread])

  return created[0]
}

/**
 * Get a thread from the datastore
 * 
 * @param {String} id
 * @returns {Promise<Thread>}
 */
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

    const thread = threads.reduce((acc, row) => {
      if (!acc.id) {
        acc = new Thread(row)
      }

      if (row.step_id) {
        acc.addStep({
          id: row.step_id,
          thread_id: row.thread_id,
          name: row.step_name,
          type: row.type,
          start_time: row.step_start_time,
          end_time: row.step_end_time,
          input_tokens: row.step_input_tokens,
          output_tokens: row.step_output_tokens
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

/**
 * Update a thread in the datastore
 *
 * @param {String} id 
 * @param {Thread} thread 
 * @returns {Promise<Thread>}
 */
const updateThread = async (id, thread) => {
  try {
    const updated = await database('thread')
      .update({
        end_time: thread.end_time,
        output: thread.output
      })
      .where('id', id)
      .returning(['id', 'session_id', 'name', 'start_time', 'end_time', 'input', 'output'])

    return new Thread(updated[0])
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
