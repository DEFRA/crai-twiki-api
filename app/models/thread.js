class Thread {
  constructor(thread) {
    this.id = thread.id
    this.session_id = thread.session_id
    this.name = thread.name
    this.start_time = thread.start_time || new Date()
    this.end_time = thread.end_time
    this.input = thread.input
    this.output = thread.output
    this.steps = thread.steps || []
  }

  addStep(step) {
    this.steps.push(step)
  }
}

module.exports = Thread
