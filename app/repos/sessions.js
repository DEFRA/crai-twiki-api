const { database } = require('../database')
const Session = require('../models/session')

/**
 * Add multiple sessions to datastore
 * 
 * @param {Session[]} sessions 
 * @returns {Promise<Session[]>}
 */
const addSessions = async (sessions) => {
  const data = sessions.map(session => ({
    id: session.id,
    project_id: session.project_id,
    user: session.user,
    start_time: session.start_time
  }))
  
  try {
    const created = await database
      .batchInsert('session', data)
      .returning(['id', 'project_id', 'start_time'])

    return created.map(session => new Session(session))
  } catch (err) {
    console.error(`Error adding sessions: ${err}`)

    if (err.code === '23505') {
      err.type = 'ENTITY_CONFLICT'
    }

    if (err.code === '23503') {
      err.type = 'PROJECT_NOT_FOUND'
    }
    
    throw err
  }
}

/**
 * Add a single session to datastore
 * 
 * @param {Session} session 
 * @returns {Promise<Session>}
 */
const addSession = async (session) => {
  const created = await addSessions([session])

  return created[0]
}

/**
 * Update a session in the datastore
 * 
 * @param {String} id - UUID of session
 * @param {Session} session - Session object with updated fields
 * @returns {Promise<Session>}
 */
const updateSession = async (id, session) => {
  try {
    const updated = await database('session')
      .update({
        end_time: session.end_time
      })
      .where('id', id)
      .returning(['id', 'project_id', 'start_time', 'end_time'])

    return new Session(updated[0])
  } catch (err) {
    console.error(`Error updating session: ${err}`)

    throw err
  }
}

/**
 * Get a session from the datastore
 * 
 * @param {String} id 
 * @returns {Promise<Session>}
 */
const getSession = async (id) => {
  try {
    const sessions = await database('session')
      .select({
        id: 'session.id',
        project_id: 'session.project_id',
        user: 'session.user',
        start_time: 'session.start_time',
        end_time: 'session.end_time',
        thread_id: 'thread.id',
        thread_name: 'thread.name',
        thread_start_time: 'thread.start_time',
        thread_end_time: 'thread.end_time'
      })
      .leftJoin('thread', 'session.id', 'thread.session_id')
      .where('session.id', id)

    if (!sessions.length) {
      return null
    }

    const session = sessions.reduce((acc, row) => {
      if (!acc.id) {
        acc = new Session(row)
      }

      if (row.thread_id) {
        acc.addThread({
          id: row.thread_id,
          name: row.thread_name,
          start_time: row.thread_start_time,
          end_time: row.thread_end_time
        })
      }

      return acc
    }, {})

    return session
  } catch (err) {
    console.error(`Error getting session: ${err}`)

    throw err
  }
}

module.exports = {
  addSessions,
  addSession,
  updateSession,
  getSession
}
