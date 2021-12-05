import { Value } from "../value"

type Class<T> = new (...args: any[]) => T

export class InternalError extends Error {
  constructor(public message: string) {
    super(message)
  }

  static wrong_target(
    target: Value,
    opts: { expected: Array<Class<Value>> }
  ): InternalError {
    const expected = opts.expected.map((c) => c.name).join(", ")

    return new InternalError(
      [
        `I expect the target to be an instance of:`,
        `  ${expected}`,
        `but given target class name is: ${target.constructor.name}`,
      ].join("\n") + "\n"
    )
  }

  static wrong_target_t(
    target_t: Value,
    opts: { expected: Array<Class<Value>> }
  ): InternalError {
    const expected = opts.expected.map((c) => c.name).join(", ")

    return new InternalError(
      [
        `I expect the type of the neutral to be an instance of:`,
        `  ${expected}`,
        `but the given target type class name is: ${target_t.constructor.name}`,
      ].join("\n") + "\n"
    )
  }
}
