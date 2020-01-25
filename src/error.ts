export class ErrorReport extends Error {
  constructor(
    public message_list: Array<string>,
  ) {
    super(merge_message_list(message_list))
  }

  append(message: string) {
    new ErrorReport([
      ...this.message_list,
      message,
    ])
  }

  prepend(message: string) {
    new ErrorReport([
      message,
      ...this.message_list,
    ])
  }
}

function merge_message_list(message_list: Array<string>): string {
  let s = ""
  s += "------\n"
  for (let message of message_list) {
    s += message
    s += "------\n"
  }
  return s
}
