class Project {
  constructor (project) {
    this.id = project.id
    this.name = project.name
    this.created_on = project.created_on || new Date()
    this.sessions = project.sessions || []
  }

  addSession (session) {
    this.sessions.push(session)
  }
}

module.exports = Project
