const { database } = require('../database')

const addThreads = async (threads) => {
  try {
    const created = await database
      .batchInsert('session', threads)
      .returning(['id', 'session_id', 'name', 'start_time', 'input',])

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
        output: 'thread.output'
      })
      .where('thread.id', id)

    if (!threads.length) {
      return null
    }

    return threads[0]
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
