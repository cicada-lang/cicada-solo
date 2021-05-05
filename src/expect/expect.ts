import { Value } from "../value"
import { Ctx } from "../ctx"
import { Trace } from "../trace"
import { readback } from "../readback"
import * as Cores from "../cores"

type Class<T> = new (...args: any[]) => T

export function expect<T>(ctx: Ctx, value: Value, TheClass: Class<T>): T {
  if (value instanceof TheClass) {
    return value
  } else {
    try {
      const exp = readback(ctx, new Cores.TypeValue(), value)
      const message =
        `I see unexpected value: ${exp.repr()}\n` +
        `The asserted class is: ${TheClass.name}.\n`
      throw new Trace(message)
    } catch (error) {
      // NOTE If the error make us not be able to readback the value as `TypeValue`.
      //   we report error without `exp.repr`
      const message =
        `I expect the value to be a Type\n` +
        `But I see unexpected value class: ${value.constructor.name},\n` +
        `The asserted class is: ${TheClass.name}.\n`
      throw new Trace(message)
    }
  }
}
