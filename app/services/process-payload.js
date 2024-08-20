const Project = require('../models/project')
const Session = require('../models/session')
const Step = require('../models/step')
const Thread = require('../models/thread')
const { addProjects } = require('../repos/projects')
const { addSessions } = require('../repos/sessions')
const { addSteps } = require('../repos/steps')
const { addThreads } = require('../repos/threads')

const processPayload = async (payload) => {
  const projects = []
  const sessions = []
  const threads = []
  const steps = []

  payload.projects.forEach(project => {
    const projectData = new Project(project)
    projects.push(projectData)

    project.sessions.forEach(session => {
      const sessionData = new Session(session)
      sessions.push(sessionData)

      session.threads.forEach(thread => {
        const threadData = new Thread(thread)
        threads.push(threadData)

        thread.steps.forEach(step => {
          const stepData = new Step(step)
          steps.push(stepData)
        })
      })
    })
  })

  await addProjects(projects)
  await addSessions(sessions)
  await addThreads(threads)
  await addSteps(steps)
}

module.exports = {
  processPayload
}
