class Step {
  constructor(step) {
    this.id = step.id
    this.thread_id = step.thread_id
    this.name = step.name
    this.start_time = step.start_time || new Date()
    this.end_time = step.end_time
    this.input = step.input
    this.output = step.output
    this.model_name = step.model_name
    this.model_metadata = step.model_metadata
    this.input_tokens = step.input_tokens
    this.output_tokens = step.output_tokens
  }
}

module.exports = Step
