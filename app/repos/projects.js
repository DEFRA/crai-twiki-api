const Project = require('../models/project')
const { database } = require('../database')

/**
 * Add multiple projects to datastore
 *
 * @param {Project[]} projects - Array of projects to add
 *
 * @returns {Promise<Project[]>} - Created projects
 */
const addProjects = async (projects) => {
  try {
    const created = await database
      .batchInsert('project', projects)
      .returning(['id', 'name', 'created_on'])

    return created
  } catch (err) {
    console.error(`Error adding projects: ${err}`)

    if (err.code === '23505') {
      err.type = 'ENTITY_CONFLICT'
    }

    throw err
  }
}

/**
 * Add a project to datastore
 *
 * @param {Project} project - Project to add
 * @returns {Promise<Project>} - Created project
 */
const addProject = async (project) => {
  const created = await addProjects([project])

  return created[0]
}

/**
 * Get list of all projects
 *
 * @returns {Promise<Project[]>}
 */
const getProjects = async () => {
  try {
    const projects = await database('project')
      .select({
        id: 'project.id',
        name: 'project.name',
        created_on: 'project.created_on'
      })

    return projects
  } catch (err) {
    console.error(`Error getting projects: ${err}`)

    throw err
  }
}

/**
 * Get a project by specified ID
 *
 * @param {String} id - Project ID
 * @returns {Promise<Project>} - Project with related sessions
 */
const getProject = async (id) => {
  try {
    const projects = await database('project')
      .select({
        id: 'project.id',
        name: 'project.name',
        created_on: 'project.created_on',
        session_id: 'session.id',
        session_start: 'session.start_time',
        user: 'session.user',
        session_end: 'session.end_time'
      })
      .leftJoin('session', 'project.id', 'session.project_id')
      .where('project.id', id)
      .orderBy('session.start_time', 'desc')

    if (!projects.length) {
      return null
    }

    const project = projects.reduce((acc, row) => {
      if (!acc.id) {
        acc.id = row.id
        acc.name = row.name
        acc.created_on = row.created_on
        acc.sessions = []
      }

      if (row.session_id) {
        acc.sessions.push({
          id: row.session_id,
          project_id: row.id,
          project_name: row.name,
          user: row.user,
          start_time: row.session_start,
          end_time: row.session_end
        })
      }

      return acc
    }, {})

    return project
  } catch (err) {
    console.error(`Error getting project: ${err}`)

    throw err
  }
}

module.exports = {
  addProjects,
  addProject,
  getProject,
  getProjects
}
