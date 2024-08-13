class Session {
  constructor(session) {
    this.id = session.id
    this.project_id = session.project_id
    this.user = session.user
    this.start_time = session.start_time || new Date()
    this.threads = session.threads || []
  }

  addThread (thread) {
    this.threads.push(thread)
  }
}

module.exports = Session
