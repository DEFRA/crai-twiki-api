const { database } = require('../database')

const getProjectOverview = async (id) => {
  const project = await database('project')
    .select('id', 'name', 'created_on')
    .where('id', id)

  const sessions = await database('session')
    .select({
      date: database.raw('DATE(session.start_time)')
    })
    .count('session.id', { as: 'session_count' })
    .count('thread.id', { as: 'thread_count' })
    .avg({
      average_latency: database.raw('EXTRACT(EPOCH FROM (session.end_time - session.start_time))')
    })
    .leftJoin('thread', 'session.id', 'thread.session_id')
    .where('project_id', id)
    .groupBy(database.raw('DATE(session.start_time)'))

  const models = await database('step')
    .select({
      model: 'model_name',
      date: database.raw('DATE(step.start_time)')
    })
    .count('model_name', { as: 'records' })
    .sum({
      total_tokens: database.raw('input_tokens + output_tokens')
    })
    .avg({
      average_latency: database.raw('EXTRACT(EPOCH FROM (step.end_time - step.start_time))')
    })
    .innerJoin('thread', 'step.thread_id', 'thread.id')
    .innerJoin('session', 'thread.session_id', 'session.id')
    .where('session.project_id', id)
    .groupBy('model_name', database.raw('DATE(step.start_time)'))

  return {
    project,
    sessions,
    model_usage: models
  }
}

module.exports = {
  getProjectOverview
}
