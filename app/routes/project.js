const Joi = require('joi')

const Project = require('../models/project')
const { getProjects, getProject, addProject } = require('../repos/projects')

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
    method: 'POST',
    path: '/project',
    options: {
      validate: {
        payload: Joi.object({
          name: Joi.string().regex(/^[a-zA-Z0-9 ]+$/).required()
        }).required()
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
