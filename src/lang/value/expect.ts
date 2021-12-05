import { Ctx } from "../ctx"
import { ExpTrace } from "../errors"
import * as Exps from "../exps"
import { readback, Value } from "../value"

type Class<T> = new (...args: any[]) => T

export function expect<T>(ctx: Ctx, value: Value, TheClass: Class<T>): T {
  if (value instanceof TheClass) {
    return value
  } else {
    try {
      const exp = readback(ctx, new Exps.TypeValue(), value)
      const message =
        `I see unexpected value class: ${value.constructor.name},\n` +
        `which reads back to exp: ${exp.format()},\n` +
        `but the asserted class is: ${TheClass.name}.\n`
      throw new ExpTrace(message)
    } catch (error) {
      // NOTE If the error makes us
      //   not be able to readback the value as `TypeValue`,
      //   we report error without `exp.format()`.
      const message =
        `I see unexpected value class: ${value.constructor.name},\n` +
        `but the asserted class is: ${TheClass.name}.\n`
      throw new ExpTrace(message)
    }
  }
}
