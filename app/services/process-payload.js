const Project = require('../models/project')
const Session = require('../models/session')
const Step = require('../models/step')
const Thread = require('../models/thread')
const { addProjects } = require('../repos/projects')
const { addSessions } = require('../repos/sessions')
const { addSteps } = require('../repos/steps')
const { addThreads } = require('../repos/threads')

const processProjects = (projects) => projects.map(project => {
  const projectData = new Project(project)
  projectData.sessions = processSessions(project.sessions)
  return projectData
})

const processSessions = (sessions) => sessions.map(session => {
  const sessionData = new Session(session)
  sessionData.threads = processThreads(session.threads)
  return sessionData
})

const processThreads = (threads) => threads.map(thread => {
  const threadData = new Thread(thread)
  threadData.steps = processSteps(thread.steps)
  return threadData
})

const processSteps = (steps) => steps.map(step => new Step(step))

const processPayload = async (payload) => {
  const projects = processProjects(payload.projects)
  const sessions = projects.flatMap(project => project.sessions)
  const threads = sessions.flatMap(session => session.threads)
  const steps = threads.flatMap(thread => thread.steps)

  await addProjects(projects)
  await addSessions(sessions)
  await addThreads(threads)
  await addSteps(steps)
}

module.exports = {
  processPayload
}
