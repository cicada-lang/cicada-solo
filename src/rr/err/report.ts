export class Report extends Error {
  constructor(public messages: Array<string>) {
    super(merge_messages(messages))
  }

  append(message: string): Report {
    return new Report([...this.messages, message])
  }

  prepend(message: string): Report {
    return new Report([message, ...this.messages])
  }
}

function merge_messages(messages: Array<string>): string {
  let s = "\n"
  s += "------\n"
  for (let message of messages) {
    s += message
    s += "------\n"
  }
  return s
}
