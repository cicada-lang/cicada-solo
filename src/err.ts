export class Report extends Error {
  constructor(public message_list: Array<string>) {
    super(merge_message_list(message_list))
  }

  append(message: string): Report {
    return new Report([...this.message_list, message])
  }

  prepend(message: string): Report {
    return new Report([message, ...this.message_list])
  }
}

export function merge_message_list(message_list: Array<string>): string {
  let s = ""
  s += "------\n"
  for (let message of message_list) {
    s += message
    s += "------\n"
  }
  return s
}

export class Unhandled extends Error {
  constructor(public value: any) {
    super(message_for_unhandled(value))
  }
}

function message_for_unhandled(value: any) {
  if (value.abstract_class_name) {
    let message =
      `unhandled class of abstract class ${value.abstract_class_name}: ${value.constructor.name}\n` +
      `value: ${JSON.stringify(value, null, 2)}\n`
    return message
  } else {
    let message =
      `unhandled class (no abstract_class_name): ${value.constructor.name}\n` +
      `value: ${JSON.stringify(value, null, 2)}\n`
    return message
  }
}
