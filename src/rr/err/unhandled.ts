export class Unhandled extends Error {
  constructor(public value: any) {
    super(message_for_unhandled(value))
  }
}

function message_for_unhandled(value: any) {
  if (typeof value === "object" && value.abstract_class_name)
    return (
      "unhandled class of abstract class\n" +
      `abstract_class_name: ${value.abstract_class_name}\n` +
      `value.constructor.name: ${value.constructor.name}\n` +
      `value: ${JSON.stringify(value, null, 2)}\n`
    )
  else if (typeof value === "object")
    return (
      "unhandled class of abstract class\n" +
      `value.constructor.name: ${value.constructor.name}\n` +
      `value: ${JSON.stringify(value, null, 2)}\n`
    )
  else
    return (
      "unhandled class of abstract class\n" +
      `value: ${JSON.stringify(value, null, 2)}\n`
    )
}
