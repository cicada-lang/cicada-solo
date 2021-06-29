import { Trace } from "../errors"

export class InternalError<T> extends Trace<T> {
  previous: Array<T> = Array.of()

  constructor(public message: string) {
    super(message)
  }

  repr(formater: (x: T) => string): string {
    return ["[InternalError]", super.repr(formater)].join("\n")
  }
}
