const Project = require('../models/project')
const { getProjects, getProject, addProject } = require('../repos/projects')
const { getProjectOverview } = require('../repos/overview')
const { schema } = require('../schemas/project')

module.exports = [
  {
    method: 'GET',
    path: '/project',
    handler: async (request, h) => {
      const projects = await getProjects()

      if (!projects.length) {
        return h.response().code(204)
      }

      return h.response(projects).code(200)
    }
  },
  {
    method: 'GET',
    path: '/project/{projectId}',
    handler: async (request, h) => {
      const { projectId } = request.params

      const project = await getProject(projectId)

      if (!project) {
        return h.response().code(404)
      }

      return h.response(project).code(200)
    }
  },
  {
    method: 'GET',
    path: '/project/{projectId}/overview',
    handler: async (request, h) => {
      const { projectId } = request.params

      const overview = await getProjectOverview(projectId)

      if (!overview) {
        return h.response().code(404)
      }

      return h.response(overview).code(200)
    }
  },
  {
    method: 'POST',
    path: '/project',
    options: {
      validate: {
        payload: schema
      }
    },
    handler: async (request, h) => {
      try {
        const project = new Project(request.payload)

        const created = await addProject(project)

        return h.response(created).code(201)
      } catch (err) {
        if (err.type === 'ENTITY_CONFLICT') {
          return h.response().code(409)
        }

        return h.response().code(500)
      }
    }
  }
]
