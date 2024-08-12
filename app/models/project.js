class Project {
  constructor (id, name, createdOn, sessions) {
    this.id = id
    this.name = name
    this.created_on = createdOn

    if (sessions) {
      this.sessions = sessions
    }
  }

  static fromPayload (payload) {
    const project = new Project(
      payload.id,
      payload.name,
      payload.created_on || new Date()
    )

    return project
  }
}

module.exports = Project
