import { Trace } from "../errors"
import { Value } from "../value"

type Class<T> = new (...args: any[]) => T

export class InternalError<T> extends Trace<T> {
  previous: Array<T> = Array.of()

  constructor(public message: string) {
    super(message)
  }

  repr(formater: (x: T) => string): string {
    return ["[InternalError]", super.repr(formater)].join("\n")
  }

  static wrong_target<T>(
    target: Value,
    opts: { expected: Array<Class<Value>> }
  ): InternalError<T> {
    const expected = opts.expected.map((c) => c.name).join(", ")

    return new InternalError(
      [
        `I expect the target to be an instance of:`,
        `  ${expected}`,
        `but given target class name is: ${target.constructor.name}`,
      ].join("\n") + "\n"
    )
  }

  static wrong_target_t<T>(
    target_t: Value,
    opts: { expected: Array<Class<Value>> }
  ): InternalError<T> {
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
