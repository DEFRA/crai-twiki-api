class Session {
  constructor (id, projectId, user, startTime, endTime) {
    this.id = id
    this.project_id = projectId
    this.user = user
    this.start_time = startTime
    this.end_time = endTime
  }

  static fromPayload (payload) {
    const session = new Session(
      payload.id,
      payload.project_id,
      payload.user,
      payload.start_time,
      payload.end_time
    )

    return session
  }
}

module.exports = Session
