import { Value } from "../value"
import { Ctx } from "../ctx"
import { Trace } from "../trace"
import { readback } from "../readback"
import { TypeValue } from "../core"

type Class<T> = new (...args: any[]) => T

export function expect<T>(ctx: Ctx, value: Value, TheClass: Class<T>): T {
  if (value instanceof TheClass) {
    return value
  } else {
    const name = TheClass.constructor.name
    const exp = readback(ctx, new TypeValue(), value)
    const message =
      `I see unexpected ${exp.repr()}\n` +
      `But I am expecting value of ${name}.\n`
    throw new Trace(message)
  }
}
