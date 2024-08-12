class Thread {
  constructor(id, sessionId, name, startTime, endTime, input, output) {
    this.id = id
    this.session_id = sessionId
    this.name = name
    this.start_time = startTime
    this.end_time = endTime
    this.input = input
    this.output = output
  }

  static fromPayload(payload) {
    const thread = new Thread(
      payload.id,
      payload.session_id,
      payload.name,
      payload.start_time ?? new Date(),
      payload.end_time,
      payload.input,
      payload.output
    )

    return thread
  }
}

module.exports = Thread
