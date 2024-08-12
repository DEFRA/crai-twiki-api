const { database } = require('../database')

const addSessions = async (sessions) => {
  try {
    const created = await database
      .batchInsert('session', sessions)
      .returning(['id', 'project_id', 'start_time'])

    return created
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

const addSession = async (session) => {
  const created = await addSessions([session])

  return created[0]
}

const updateSession = async (id, session) => {
  try {
    const updated = await database('session')
      .update({
        end_time: session.end_time
      })
      .where('id', id)
      .returning(['id', 'project_id', 'start_time', 'end_time'])

    return updated[0]
  } catch (err) {
    console.error(`Error updating session: ${err}`)

    throw err
  }
}

const getSession = async (id) => {
  try {
    const sessions = await database('session')
      .select({
        id: 'session.id',
        project_id: 'session.project_id',
        user: 'session.user',
        start_time: 'session.start_time',
        end_time: 'session.end_time'
      })
      .where('session.id', id)

    if (!sessions.length) {
      return null
    }

    return sessions[0]
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
